// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { memo, useEffect, useState } from "react";

// // --- PROFESSIONAL AUTH MODAL COMPONENT ---
// const AuthModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-black/70 animate-in fade-in duration-300">
//       <div className="relative w-full max-w-sm bg-[#0d0d0d] border border-white/10 p-8 text-center shadow-2xl rounded-sm">
//         <div className="w-12 h-[1px] bg-[#c19977] mx-auto mb-6 opacity-50"></div>
//         <p className="text-[#c19977] uppercase tracking-[0.4em] text-[10px] mb-3">Reservations Required</p>
//         <h2 className="text-2xl font-serif italic text-white mb-4">Savor the Experience</h2>
//         <p className="text-gray-400 text-xs mb-8 leading-relaxed tracking-wide">
//           To finalize your order and explore our curated flavors, please sign in to your Meraki Cafe account.
//         </p>
//         <div className="space-y-3">
//           <Link 
//             href="/login" 
//             className="block w-full bg-[#c19977] py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-black hover:bg-[#d4b580] transition-all shadow-lg active:scale-[0.98]"
//           >
//             Authorize Access
//           </Link>
//           <button 
//             onClick={onClose}
//             className="block w-full py-3 text-[10px] uppercase tracking-widest text-gray-600 hover:text-white transition-colors"
//           >
//             Continue Browsing
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // --- SUCCESS TOAST COMPONENT ---
// const SuccessToast = ({ message, isVisible }: { message: string; isVisible: boolean }) => {
//   if (!isVisible) return null;
//   return (
//     <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-[#0d0d0d] border-l-4 border-[#c19977] px-6 py-4 shadow-2xl animate-in slide-in-from-bottom-5 duration-500">
//       <p className="text-white text-xs uppercase tracking-widest font-medium">
//         {message}
//       </p>
//     </div>
//   );
// };

// interface BackendMenuType {
//   id: number;
//   name: string;
//   description?: string;
//   price: string;
//   category: string;
//   image_url?: string;
//   badge?: string;
// }

// const MenuCard = memo(
//   ({
//     id,
//     title,
//     badge,
//     cost,
//     description,
//     image,
//   }: {
//     id: number;
//     title: string;
//     badge?: string;
//     cost: string;
//     description?: string;
//     image?: string;
//   }) => {
//     const [isOrdering, setIsOrdering] = useState(false);
//     const [quantity, setQuantity] = useState(1);
//     const [showAuthModal, setShowAuthModal] = useState(false);
//     const [showToast, setShowToast] = useState(false);

//     const handleOrder = async () => {
//       if (quantity < 1) return;

//       const token = localStorage.getItem("token");

//       if (!token) {
//         setShowAuthModal(true);
//         return;
//       }

//       setIsOrdering(true);
//       const numericPrice = parseFloat(cost.replace(/[^0-9.]/g, ""));

//       const orderPayload = {
//         items: [{ menu_id: id, quantity: quantity, unit_price: numericPrice }],
//       };

//       try {
//         const response = await fetch("https://meraki-cafe-restaurant-and-bar-one.vercel.app/api/orders", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify(orderPayload),
//         });

//         if (response.ok) {
//           setShowToast(true);
//           setTimeout(() => setShowToast(false), 4000);
//         }
//       } catch (error) {
//         console.error("Order Error:", error);
//       } finally {
//         setIsOrdering(false);
//       }
//     };

//     const increaseQuantity = () => setQuantity((q) => q + 1);
//     const decreaseQuantity = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

//     return (
//       <li>
//         <div className="menu-card hover:card" style={{ display: "flex", gap: "20px", padding: "15px" }}>
//           {image && (
//             <figure className="card-banner img-holder" style={{ "--width": "100", "--height": "100", width: "100px", flexShrink: 0 } as React.CSSProperties}>
//               <Image src={image} width={100} height={100} loading="lazy" alt={title} className="img-cover rounded-md" />
//             </figure>
//           )}

//           <div style={{ flexGrow: 1 }}>
//             <div className="title-wrapper" style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "8px" }}>
//               <h3 className="title-3"><p className="card-title">{title}</p></h3>
//               {badge && <span className="badge label-1">{badge}</span>}
//               <span className="span title-2" style={{ color: "var(--gold-color, #c19977)", marginLeft: "10px" }}>Rs. {cost}</span>
//             </div>

//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "15px", marginTop: "8px" }}>
//               {description && <p className="card-text label-1" style={{ fontSize: "14px", color: "#a6a6a6", margin: 0 }}>{description}</p>}
              
//               <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
//                 <button type="button" onClick={decreaseQuantity} style={{ padding: "4px 8px", border: "1px solid #c19977", borderRadius: "4px", background: "transparent", cursor: "pointer", color: "#c19977", fontWeight: 600 }}>-</button>
//                 <span style={{ minWidth: "20px", textAlign: "center" }}>{quantity}</span>
//                 <button type="button" onClick={increaseQuantity} style={{ padding: "4px 8px", border: "1px solid #c19977", borderRadius: "4px", background: "transparent", cursor: "pointer", color: "#c19977", fontWeight: 600 }}>+</button>
//               </div>

//               <button
//                 onClick={handleOrder}
//                 disabled={isOrdering}
//                 className="btn-order"
//                 style={{
//                   padding: "6px 14px", border: "1px solid #c19977", color: "#c19977", background: "transparent", 
//                   fontSize: "12px", fontWeight: "600", textTransform: "uppercase", borderRadius: "4px",
//                   cursor: isOrdering ? "not-allowed" : "pointer", transition: "0.3s", minWidth: "75px"
//                 }}
//                 onMouseOver={(e) => { if (!isOrdering) { e.currentTarget.style.backgroundColor = "#c19977"; e.currentTarget.style.color = "black"; } }}
//                 onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#c19977"; }}
//               >
//                 {isOrdering ? "..." : "Order"}
//               </button>
//             </div>
//           </div>
//         </div>
        
//         {/* Modal and Toast instances per card */}
//         <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
//         <SuccessToast isVisible={showToast} message={`${title} added to your selection.`} />
//       </li>
//     );
//   }
// );

// MenuCard.displayName = "MenuCard";

// const MenuCategory = memo(({ title, arr, className }: { title: string; arr: BackendMenuType[]; className?: string }) => {
//   const [isExpanded, setIsExpanded] = useState(false);
//   const itemsToShow = isExpanded ? arr : arr.slice(0, 6);
//   return (
//     <div className={className}>
//       <h2 className="headline-1 section-title text-center" style={{ marginBottom: "30px" }}>{title}</h2>
//       <ul className="grid-list" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "30px" }}>
//         {itemsToShow.map((menu) => (
//           <MenuCard key={menu.id} id={menu.id} title={menu.name} badge={menu.badge} cost={menu.price} description={menu.description} image={menu.image_url} />
//         ))}
//       </ul>
//       {arr.length > 6 && (
//         <div className="text-center" style={{ marginTop: "30px" }}>
//           <button className="btn btn-primary" onClick={() => setIsExpanded(!isExpanded)}>
//             <span className="text text-1">{isExpanded ? "See Less" : "See More"}</span>
//             <span className="text text-2" aria-hidden="true">{isExpanded ? "See Less" : "See More"}</span>
//           </button>
//         </div>
//       )}
//     </div>
//   );
// });

// MenuCategory.displayName = "MenuCategory";

// export const Menu = memo(() => {
//   const [menuList, setMenuList] = useState<BackendMenuType[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchMenu = async () => {
//       try {
//         const res = await fetch("https://meraki-cafe-restaurant-and-bar-one.vercel.app/api/menu");
//         const json = await res.json();
//         setMenuList(json.data || []);
//       } catch (err) {
//         console.error("Failed to fetch menu:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchMenu();
//   }, []);

//   if (loading) return <p className="text-center mt-20" style={{ color: "white" }}>Loading menu...</p>;

//   const groupedMenu = menuList.reduce((acc: Record<string, BackendMenuType[]>, item) => {
//     const category = item.category || "Uncategorized";
//     if (!acc[category]) acc[category] = [];
//     acc[category].push(item);
//     return acc;
//   }, {});

//   return (
//     <section className="section menu" id="menu" style={{ backgroundColor: "#0e1317", color: "white", padding: "80px 0" }}>
//       <div className="custom-container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 15px" }}>
//         <p className="section-subtitle text-center label-2" style={{ color: "#c19977" }}>Special Selection</p>
//         {Object.entries(groupedMenu).map(([category, items]) => (
//           <MenuCategory key={category} title={category} arr={items} className="mt-40" />
//         ))}
//       </div>
//     </section>
//   );
// });

// Menu.displayName = "Menu";

"use client";

import Image from "next/image";
import Link from "next/link";
import { memo, useEffect, useState } from "react";

// --- PROFESSIONAL AUTH MODAL COMPONENT ---
const AuthModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-black/70 animate-in fade-in duration-300">
      <div className="relative w-full max-w-sm bg-[#0d0d0d] border border-white/10 p-8 text-center shadow-2xl rounded-sm">
        <div className="w-12 h-[1px] bg-[#c19977] mx-auto mb-6 opacity-50"></div>
        <p className="text-[#c19977] uppercase tracking-[0.4em] text-[10px] mb-3">Reservations Required</p>
        <h2 className="text-2xl font-serif italic text-white mb-4">Savor the Experience</h2>
        <p className="text-gray-400 text-xs mb-8 leading-relaxed tracking-wide">
          To finalize your order and explore our curated flavors, please sign in to your Meraki Cafe account.
        </p>
        <div className="space-y-3">
          <Link 
            href="/login" 
            className="block w-full bg-[#c19977] py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-black hover:bg-[#d4b580] transition-all shadow-lg active:scale-[0.98]"
          >
            Authorize Access
          </Link>
          <button 
            onClick={onClose}
            className="block w-full py-3 text-[10px] uppercase tracking-widest text-gray-600 hover:text-white transition-colors"
          >
            Continue Browsing
          </button>
        </div>
      </div>
    </div>
  );
};

// --- SUCCESS TOAST COMPONENT ---
const SuccessToast = ({ message, isVisible }: { message: string; isVisible: boolean }) => {
  if (!isVisible) return null;
  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-[#0d0d0d] border-l-4 border-[#c19977] px-6 py-4 shadow-2xl animate-in slide-in-from-bottom-5 duration-500">
      <p className="text-white text-xs uppercase tracking-widest font-medium">
        {message}
      </p>
    </div>
  );
};

interface BackendMenuType {
  id: number;
  name: string;
  description?: string;
  price: string;
  category: string;
  image_url?: string;
  badge?: string;
}

const MenuCard = memo(
  ({ id, title, badge, cost, description, image }: {
    id: number; title: string; badge?: string; cost: string; description?: string; image?: string;
  }) => {
    const [isOrdering, setIsOrdering] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const handleOrder = async () => {
      if (quantity < 1) return;
      const token = localStorage.getItem("token");
      if (!token) {
        setShowAuthModal(true);
        return;
      }

      setIsOrdering(true);
      const numericPrice = parseFloat(cost.replace(/[^0-9.]/g, ""));
      const orderPayload = {
        items: [{ menu_id: id, quantity: quantity, unit_price: numericPrice }],
      };

      try {
        const response = await fetch("https://meraki-cafe-restaurant-and-bar-one.vercel.app/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(orderPayload),
        });

        if (response.ok) {
          setShowToast(true);
          setTimeout(() => setShowToast(false), 4000);
        }
      } catch (error) {
        console.error("Order Error:", error);
      } finally {
        setIsOrdering(false);
      }
    };

    return (
      <li className="-mb-10"> {/* Adjusted spacing to match original menu card flow */}
        <div className="menu-card hover:card">
          <div className="flex gap-5 p-4 items-start">
            {image && (
              <figure className="card-banner img-holder flex-shrink-0" style={{ width: "80px", height: "80px" }}>
                <Image src={image} width={80} height={80} loading="lazy" alt={title} className="img-cover rounded-sm" />
              </figure>
            )}

            <div className="flex-grow">
              <div className="title-wrapper flex justify-between items-baseline mobile:block">
                <div className="flex gap-2 items-center">
                   <h3 className="title-3">
                     <p className="card-title">{title}</p>
                   </h3>
                   {badge && <span className="badge label-1">{badge}</span>}
                </div>
                <span className="span title-2">Rs. {cost}</span>
              </div>

              {description && (
                <p className="card-text label-1 mt-1 opacity-60">
                  {description}
                </p>
              )}

              {/* Order Controls */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-3 border border-white/10 rounded-sm px-2 py-1">
                  <button onClick={() => setQuantity(q => q > 1 ? q - 1 : 1)} className="text-[#c19977] font-bold px-2 hover:scale-125 transition-transform">-</button>
                  <span className="label-2 min-w-[15px] text-center">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} className="text-[#c19977] font-bold px-2 hover:scale-125 transition-transform">+</button>
                </div>

                <button
                  onClick={handleOrder}
                  disabled={isOrdering}
                  className="btn-secondary px-6 py-2 label-2 uppercase tracking-widest border border-[#c19977] text-[#c19977] hover:bg-[#c19977] hover:text-black transition-all"
                >
                  {isOrdering ? "..." : "Order"}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
        <SuccessToast isVisible={showToast} message={`${title} added to selection.`} />
      </li>
    );
  }
);

MenuCard.displayName = "MenuCard";

const MenuCategory = memo(({ title, arr, className }: { title: string; arr: BackendMenuType[]; className?: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const itemsToShow = isExpanded ? arr : arr.slice(0, 6);
  
  return (
    <div className={className}>
      <h2 className="headline-1 section-title text-center">{title}</h2>
      <ul className="grid-list">
        {itemsToShow.map((menu) => (
          <MenuCard 
            key={menu.id} 
            id={menu.id} 
            title={menu.name} 
            badge={menu.badge} 
            cost={menu.price} 
            description={menu.description} 
            image={menu.image_url} 
          />
        ))}
      </ul>
      {arr.length > 6 && (
        <button className="btn btn-primary mt-30 mx-auto" onClick={() => setIsExpanded(!isExpanded)}>
          <span className="text text-1">{isExpanded ? "See Less" : "See More"}</span>
          <span className="text text-2" aria-hidden="true">{isExpanded ? "See Less" : "See More"}</span>
        </button>
      )}
    </div>
  );
});

MenuCategory.displayName = "MenuCategory";

export const Menu = memo(() => {
  const [menuList, setMenuList] = useState<BackendMenuType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch("https://meraki-cafe-restaurant-and-bar-one.vercel.app/api/menu");
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

  if (loading) return <div className="section text-center"><p className="headline-1">Loading...</p></div>;

  const groupedMenu = menuList.reduce((acc: Record<string, BackendMenuType[]>, item) => {
    const category = item.category || "General";
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {});

  return (
    <section className="section menu" aria-label="menu-label" id="menu">
      <div className="custom-container">
        <p className="section-subtitle text-center label-2">Special Selection</p>

        {Object.entries(groupedMenu).map(([category, items]) => (
          <MenuCategory 
            key={category} 
            title={category} 
            arr={items} 
            className="mt-40" 
          />
        ))}

        <p className="menu-text text-center" style={{ marginTop: '80px' }}>
          Daily from <span className="span">9:00 am</span> to <span className="span">10:00 pm</span>
        </p>

        {/* Decorative Shapes Restored */}
        <Image src="/images/shapes/shape-5.webp" width={921} height={1036} loading="lazy" alt="" className="shape shape-2 move-anim" />
        <Image src="/images/shapes/shape-6.webp" width={343} height={345} loading="lazy" alt="" className="shape shape-3 move-anim" />
      </div>
    </section>
  );
});

Menu.displayName = "Menu";