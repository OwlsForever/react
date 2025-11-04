import React from "react";
import Page from "./page";
import { createRoot } from "react-dom/client";
import "../../assets/scss/index.scss";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");
createRoot(rootElement).render(<Page />)
