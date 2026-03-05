export interface Link {
    name: string;
    href: string;
}

export interface NavLink extends Link {
    isActive?: boolean;
}

export interface MenuType {
    title: string;
    badge?: string;
    cost: string;
    description?: string;
    imgSrc?: string;
}

export interface Menu {
    menu_name: string;
    menu_list: MenuType[];
}

export interface TestimonialItem {
    name: string;
    imgSrc?: string;
    review: string;
}

export interface SlideButton {
    onClick: () => void; 
    onMouseOut: () => void; 
    onMouseOver: () => void;
}

export interface Event {
    imgSrc: string;
}

export interface AlertState {
    isVisible: boolean;
    type: "success" | "error";
    title?: string;
    message: string;
}