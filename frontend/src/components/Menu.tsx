"use client";

import { MENU_LIST } from "@/constants";
import { MenuType } from "@/types";
import Image from "next/image";
import { memo, useState } from "react";

const MenuCard = memo(({ title, badge, cost, description, imgSrc }: MenuType) => (
  <li>
    <div className="menu-card hover:card">
      <figure
        className="card-banner img-holder"
        style={
          {
            "--width": "100",
            "--height": "100",
            width: "100px",
          } as React.CSSProperties
        }
      >
        <Image
          src="/images/event-hall/eh-1.webp"
        // src={imgSrc}
          width={100}
          height={100}
          loading="lazy"
          alt="Greek Salad"
          className="img-cover"
        />
      </figure>
      <div>
        <div className="title-wrapper">
          <h3 className="title-3">
            <p className="card-title">{title}</p>
          </h3>
          {badge && <span className="badge label-1">{badge}</span>}
          <span className="span title-2">Rs. {cost}</span>
        </div>
        {description && <p className="card-text label-1">{description}</p>}
      </div>
    </div>
  </li>
));

MenuCard.displayName = "MenuCard";

const MenuCategory = memo(
  ({
    title,
    arr,
    className,
  }: {
    title: string;
    arr: MenuType[];
    className?: string;
  }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const itemsToShow = isExpanded ? arr : arr.slice(0, 6);

    const toggleExpanded = () => {
      setIsExpanded(!isExpanded);
    };

    return (
      <div className={className}>
        <h2 className="headline-1 section-title text-center">{title}</h2>
        <ul className="grid-list">
          {itemsToShow.map((menu, index) => (
            <MenuCard
              key={index}
              title={menu.title}
              badge={menu.badge}
              cost={menu.cost}
            />
          ))}
        </ul>

        {arr.length > 6 && (
          <button className="btn btn-primary mt-30" onClick={toggleExpanded}>
            <span className="text text-1">
              {isExpanded ? "See Less" : "See More"}
            </span>
            <span className="text text-2" aria-hidden="true">
              {isExpanded ? "See Less" : "See More"}
            </span>
          </button>
        )}
      </div>
    );
  },
);

MenuCategory.displayName = "MenuCategory";

export const Menu = memo(() => (
  <section className="section menu" aria-label="menu-label" id="menu">
    <div className="custom-container">
      <p className="section-subtitle text-center label-2">Special Selection</p>

      {MENU_LIST.map((menu) => (
        <MenuCategory
          key={menu.menu_name}
          title={menu.menu_name}
          arr={menu.menu_list}
          className={`${menu.menu_name === "BBQ Special" ? "mt-20" : "mt-40"}`}
        />
      ))}

      <p className="menu-text text-center" style={{ marginTop: "80px" }}>
        Daily from <span className="span">9:00 am</span> to{" "}
        <span className="span">10:00 pm</span>
      </p>

      <Image
        src="/images/shapes/shape-5.webp"
        width={921}
        height={1036}
        loading="lazy"
        alt="shape"
        className="shape shape-2 move-anim"
      />

      <Image
        src="/images/shapes/shape-6.webp"
        width={343}
        height={345}
        loading="lazy"
        alt="shape"
        className="shape shape-3 move-anim"
      />
    </div>
  </section>
));

Menu.displayName = "Menu";
