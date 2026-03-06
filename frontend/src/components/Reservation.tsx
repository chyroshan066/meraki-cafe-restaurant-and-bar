"use client";

import { memo, useCallback, useMemo, useState } from "react";
import { IonIcon } from "./utility/IonIcon";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReservationFormData, ReservationFormSchema } from "@/middlewares/schema";
import { ErrorMessage, InputField } from "./utility/InputField";
import { SubmitButton } from "./utility/Button/SubmitButton";
import { Alert } from "./Alert";
import { AlertState } from "@/types";

const initialValues: ReservationFormData = {
    name: "",
    phone: "",
    person: "1-person",
    date: "",
    time: "10:00am",
    message: "",
};

export const Reservation = memo(() => {
    const [alertState, setAlertState] = useState<AlertState>({
        isVisible: false,
        type: "success",
        message: "",
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<ReservationFormData>({
        defaultValues: initialValues,
        resolver: zodResolver(ReservationFormSchema),
        mode: "onChange",
    });

    const showAlert = useCallback((
        type: AlertState["type"],
        message: string,
        title?: string
    ) => {
        setAlertState({
            isVisible: true,
            type,
            message,
            title,
        });
    }, []);

    const hideAlert = useCallback(() => {
        setAlertState(prev => ({
            ...prev,
            isVisible: false,
        }));
    }, []);

    // Convert 12hr format to 24hr (HH:MM)
    const formatTime = (time: string) => {
        const isPM = time.toLowerCase().includes("pm");
        let [hour] = time.replace(/am|pm/i, "").split(":");
        let hourNum = parseInt(hour);

        if (isPM && hourNum !== 12) hourNum += 12;
        if (!isPM && hourNum === 12) hourNum = 0;

        return `${hourNum.toString().padStart(2, "0")}:00`;
    };

    const handleFormSubmit = useCallback(async (data: ReservationFormData) => {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            throw new Error("You must be logged in to make a reservation.");
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

        const response = await fetch("http://localhost:5000/api/reservations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // ✅ TOKEN ADDED HERE
            },
            body: JSON.stringify(formattedData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to create reservation");
        }

        showAlert(
            "success",
            "Your table has been reserved successfully!",
            "Table Reserved!"
        );

        reset(initialValues);

    } catch (error) {
        const errorMessage =
            error instanceof Error
                ? error.message
                : "Something went wrong while booking the table.";

        showAlert("error", errorMessage, "Reservation Failed");
        console.error("Reservation error:", error);
    }
}, [reset, showAlert]);

    const onFormSubmit = handleSubmit(handleFormSubmit);

    const isButtonDisabled = useMemo(
        () => isSubmitting,
        [isSubmitting]
    );

    const buttonText = useMemo(
        () => isSubmitting ? "Booking..." : "Book A Table",
        [isSubmitting]
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

            <section className="reservation" id="contact">
                <div className="custom-container">
                    <div className="form reservation-form bg-black-10">
                        <form
                            className="form-left"
                            onSubmit={onFormSubmit}
                            noValidate
                        >
                            <h2 className="headline-1 text-center">
                                Online Reservation
                            </h2>

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

                                    <select
                                        {...register("person")}
                                        className="input-field"
                                    >
                                        {[...Array(7)].map((_, index) => (
                                            <option
                                                key={index}
                                                value={`${index + 1}-person`}
                                            >
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

                                    <select
                                        {...register("time")}
                                        className="input-field"
                                    >
                                        {[...Array(3)].map((_, index) => (
                                            <option
                                                key={index}
                                                value={`${10 + index}:00am`}
                                            >
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
                    </div>
                </div>
            </section>
        </>
    );
});

Reservation.displayName = "Reservation";