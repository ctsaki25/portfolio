import Projects from "@/components/projects/Projects";
import { routerType } from "../types/router.types";
import Home from "./home";
import AdminProjects from "@/components/admin/AdminProjects";
import Contact from "@/components/contact/Contact";
import Skills from "./skills";
import Testimonials from "./testimonials";
import AdminTestimonials from "@/components/admin/AdminTestimonials";
const pagesData: routerType[] = [
  {
    path: "",
    element: <Home />,
    title: "home",
  },
  {
    path: "projects",
    element: <Projects />,
    title: "projects",
  },
  {
    path: "admin/projects",
    element: <AdminProjects />,
    title: "admin-projects",
  },
  {
    path: "contact",
    element: <Contact />,
    title: "contact",
  },
  {
    path: "skills",
    element: <Skills />,
    title: "skills",
  },
  {
    path: "testimonials",
    element: <Testimonials />,
    title: "testimonials",
  },
  {
    path: "admin/testimonials",
    element: <AdminTestimonials />,
    title: "admin-testimonials",
  },
];


export default pagesData;
