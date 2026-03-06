"use client";

import Image from "next/image";
import { memo, useEffect, useState } from "react";

// Type for menu items returned by backend
interface BackendMenuType {
  id: number;
  name: string;
  description?: string;
  price: string;
  category: string;
  image_url?: string;
  badge?: string;
}

// Updated MenuCard to include badge, description, and image
const MenuCard = memo(
  ({
    title,
    badge,
    cost,
    description,
    image,
  }: {
    title: string;
    badge?: string;
    cost: string;
    description?: string;
    image?: string;
  }) => (
    <li>
      <div className="menu-card hover:card">
        {image && (
          <figure
            className="card-banner img-holder"
            style={{
              "--width": "100",
              "--height": "100",
              width: "100px",
            } as React.CSSProperties}
          >
            <Image
              src={image}
              width={100}
              height={100}
              loading="lazy"
              alt={title}
              className="img-cover rounded-md"
            />
          </figure>
        )}
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
  ),
);

MenuCard.displayName = "MenuCard";

// MenuCategory supports "See More/Less" and shows backend menu items
const MenuCategory = memo(
  ({
    title,
    arr,
    className,
  }: {
    title: string;
    arr: BackendMenuType[];
    className?: string;
  }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const itemsToShow = isExpanded ? arr : arr.slice(0, 6);

    const toggleExpanded = () => setIsExpanded(!isExpanded);

    return (
      <div className={className}>
        <h2 className="headline-1 section-title text-center">{title}</h2>
        <ul className="grid-list">
          {itemsToShow.map((menu) => (
            <MenuCard
              key={menu.id}
              title={menu.name}
              badge={menu.badge}
              cost={menu.price}
              description={menu.description}
              image={menu.image_url}
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

export const Menu = memo(() => {
  const [menuList, setMenuList] = useState<BackendMenuType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/menu");
        const json = await res.json();
        setMenuList(json.data || []);
      } catch (err) {
        console.error("Failed to fetch menu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  if (loading) return <p className="text-center mt-20">Loading menu...</p>;

  // Group menu items by category
  const groupedMenu = menuList.reduce(
    (acc: Record<string, BackendMenuType[]>, item) => {
      const category = item.category || "Uncategorized";
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    },
    {}
  );

  return (
    <section className="section menu" aria-label="menu-label" id="menu">
      <div className="custom-container">
        <p className="section-subtitle text-center label-2">Special Selection</p>

        {Object.entries(groupedMenu).map(([category, items]) => (
          <MenuCategory
            key={category}
            title={category}
            arr={items}
            className={`${category === "BBQ Special" ? "mt-20" : "mt-40"}`}
          />
        ))}

        <p className="menu-text text-center" style={{ marginTop: "80px" }}>
          Daily from <span className="span">9:00 am</span> to{" "}
          <span className="span">10:00 pm</span>
        </p>

        {/* Decorative shapes */}
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
  );
});

Menu.displayName = "Menu";