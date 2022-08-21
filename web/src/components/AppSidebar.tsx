import { useState } from "react";

export function AppSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(prevState => !prevState)
  }
}