"use client";

import { memo, useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { IonIcon } from "./utility/IonIcon";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ReservationFormData,
  ReservationFormSchema,
} from "@/middlewares/schema";
import { ErrorMessage, InputField } from "./utility/InputField";
import { SubmitButton } from "./utility/Button/SubmitButton";
import { Alert } from "./Alert";
import { AlertState } from "@/types";

// --- PROFESSIONAL AUTH MODAL COMPONENT ---
const AuthModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-black/70 animate-in fade-in duration-300">
      <div className="relative w-full max-w-sm bg-[#0d0d0d] border border-white/10 p-8 text-center shadow-2xl rounded-sm">
        <div className="w-12 h-[1px] bg-[#c19977] mx-auto mb-6 opacity-50"></div>
        <p className="text-[#c19977] uppercase tracking-[0.4em] text-[10px] mb-3">
          Priority Access
        </p>
        <h2 className="text-2xl font-serif italic text-white mb-4">
          Secure Your Table
        </h2>
        <p className="text-gray-400 text-xs mb-8 leading-relaxed tracking-wide">
          To manage your reservations and ensure a seamless dining experience,
          please sign in to your Meraki Cafe account.
        </p>
        <div className="space-y-3">
          <Link
            href="/login"
            className="block w-full bg-[#c19977] py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-black hover:bg-[#d4b580] transition-all shadow-lg active:scale-[0.98]"
          >
            Authorize & Book
          </Link>
          <button
            onClick={onClose}
            className="block w-full py-3 text-[10px] uppercase tracking-widest text-gray-600 hover:text-white transition-colors"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};

const initialValues: ReservationFormData = {
  name: "",
  phone: "",
  person: "1-person",
  date: "",
  time: "10:00am",
  message: "",
};

export const Reservation = memo(() => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [alertState, setAlertState] = useState<AlertState>({
    isVisible: false,
    type: "success",
    message: "",
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReservationFormData>({
    defaultValues: initialValues,
    resolver: zodResolver(ReservationFormSchema),
    mode: "onChange",
  });

  const showAlert = useCallback(
    (type: AlertState["type"], message: string, title?: string) => {
      setAlertState({
        isVisible: true,
        type,
        message,
        title,
      });
    },
    [],
  );

  const hideAlert = useCallback(() => {
    setAlertState((prev) => ({
      ...prev,
      isVisible: false,
    }));
  }, []);

  const handleFormSubmit = useCallback(
    async (data: ReservationFormData) => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          // Trigger the professional modal instead of a boring alert
          setShowAuthModal(true);
          return;
        }

        const number_of_guests = parseInt(data.person.split("-")[0]);

        const formatTime = (time: string) => {
          const isPM = time.toLowerCase().includes("pm");
          let [hour] = time.replace(/am|pm/i, "").split(":");
          let hourNum = parseInt(hour);
          if (isPM && hourNum !== 12) hourNum += 12;
          if (!isPM && hourNum === 12) hourNum = 0;
          return `${hourNum.toString().padStart(2, "0")}:00`;
        };

        const formattedData = {
          date: data.date,
          time: formatTime(data.time),
          number_of_guests,
          name: data.name,
          phone_no: data.phone,
          message: data.message,
        };

        const response = await fetch(
          "https://meraki-cafe-restaurant-and-bar-one.vercel.app/api/reservations",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formattedData),
          },
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to create reservation");
        }

        showAlert(
          "success",
          "Your table has been reserved successfully!",
          "Table Reserved!",
        );

        reset(initialValues);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Something went wrong while booking the table.";

        showAlert("error", errorMessage, "Reservation Failed");
      }
    },
    [reset, showAlert],
  );

  const onFormSubmit = handleSubmit(handleFormSubmit);

  const isButtonDisabled = useMemo(() => isSubmitting, [isSubmitting]);
  const buttonText = useMemo(
    () => (isSubmitting ? "Booking..." : "Book A Table"),
    [isSubmitting],
  );

  return (
    <>
      <Alert
        type={alertState.type}
        title={alertState.title}
        message={alertState.message}
        isVisible={alertState.isVisible}
        onDismiss={hideAlert}
        autoDismiss={true}
        autoDismissDelay={6000}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      <section className="reservation" id="contact">
        <div className="custom-container">
          <div className="form reservation-form bg-black-10">
            <form className="form-left" onSubmit={onFormSubmit} noValidate>
              <h2 className="headline-1 text-center">Online Reservation</h2>
              <p className="form-text text-center">
                Booking request{" "}
                <a href="tel:+88123123456" className="link">
                  +88-123-123456{" "}
                </a>
                or fill out the order form
              </p>
              <div className="input-wrapper">
                <InputField
                  id="name"
                  placeholder="Your Name"
                  register={register("name")}
                  error={errors.name?.message}
                  disabled={isSubmitting}
                />

                <InputField
                  id="phone"
                  type="tel"
                  placeholder="Phone Number"
                  register={register("phone")}
                  error={errors.phone?.message}
                  disabled={isSubmitting}
                />
              </div>

              <div className="input-wrapper">
                <div className="icon-wrapper">
                  <IonIcon name="person-outline" />
                  <select {...register("person")} className="input-field">
                    {[...Array(7)].map((_, index) => (
                      <option key={index} value={`${index + 1}-person`}>
                        {index + 1} Person
                      </option>
                    ))}
                  </select>
                  <ErrorMessage message={errors.person?.message} />
                </div>

                <div className="icon-wrapper">
                  <IonIcon name="calendar-clear-outline" />
                  <InputField
                    id="date"
                    type="date"
                    register={register("date")}
                    error={errors.date?.message}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="icon-wrapper">
                  <IonIcon name="time-outline" />
                  <select {...register("time")} className="input-field">
                    {[...Array(3)].map((_, index) => (
                      <option key={index} value={`${10 + index}:00am`}>
                        {10 + index}:00 am
                      </option>
                    ))}
                    {[...Array(10)].map((_, index) => (
                      <option
                        key={index}
                        value={`${index < 9 ? `0${1 + index}` : 1 + index}:00pm`}
                      >
                        {index < 9 ? `0${1 + index}` : 1 + index}:00 pm
                      </option>
                    ))}
                  </select>
                  <ErrorMessage message={errors.time?.message} />
                </div>
              </div>

              <InputField
                id="message"
                placeholder="Message"
                register={register("message")}
                isTextarea={true}
                error={errors.message?.message}
                disabled={isSubmitting}
              />

              <SubmitButton
                isButtonDisabled={isButtonDisabled}
                btnText={buttonText}
              />
            </form>
            
            {/* FORM RIGHT - Visual Contact Section */}
            <div
              className="form-right text-center"
              style={
                {
                  backgroundImage: "url('/images/form-pattern.webp')",
                } as React.CSSProperties
              }
            >
              <h2 className="headline-1 text-center">Contact Us</h2>
              <p className="contact-label">Booking Request</p>
              <a
                href="tel:+88123123456"
                className="body-1 contact-number hover-underline"
              >
                +977-25-570068
              </a>
              <div className="separator"></div>
              <p className="contact-label">Location</p>
              <address className="body-4">
                Ganeshman Chowk, <br />
                Dharan, Nepal
              </address>
              <p className="contact-label">Daily</p>
              <p className="body-4">
                Monday to Sunday <br />
                9.00 am - 10.00pm
              </p>
            </div>




          </div>
        </div>
      </section>
    </>
  );
});

Reservation.displayName = "Reservation";
