import { Router } from "express";
import { getAllNewsletterSubscribers, subscribeToNewsletter } from "../controllers";

export const newsletterRoute = Router({
    caseSensitive: true,
    strict: true
})

newsletterRoute.get("/", getAllNewsletterSubscribers)
newsletterRoute.post("/", subscribeToNewsletter)