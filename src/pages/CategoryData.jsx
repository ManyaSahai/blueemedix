import ayurveda from "../images/ayurveda.png";
import babycare from "../images/babycare.jpg";
import covidpre from "../images/covidpre.jpg";

import diabetes from "../images/diabetes.png";
import featured from "../images/featured.png";
import fitt from "../images/fitt&supp.png";

import healthcarecond from "../images/healthcarecond.png";
import healthcaredev from "../images/healthcaredev.png";
import personalcare from "../images/personalcare.jpg";
import other from "../images/other.png";
import all from "../images/all.jpg";

const categoryData = [
  {
    label: "All",
    image: all,
    path: "/category/all",
  },
  {
    label: "Baby Care",
    image: babycare,
    path: "/category/baby-care",
  },
  {
    label: "Ayurveda",
    image: ayurveda,
    path: "/category/ayurveda",
  },
  {
    label: "Diabetes",
    image: diabetes,
    path: "/category/diabetes",
  },
  {
    label: "Personal Care",
    image: personalcare,
    path: "/category/personal-care",
  },
  {
    label: "Featured",
    image: featured,
    path: "/category/featured",
  },
  {
    label: "Fitness & Supplements",
    image: fitt,
    path: "/category/fitness-supplements",
  },
  {
    label: "Covid Prevention",
    image: covidpre,
    path: "/category/covid-prevention",
  },
  {
    label: "Healthcare Devices",
    image: healthcaredev,
    path: "/category/healthcare-devices",
  },
  {
    label: "Health Conditions",
    image: healthcarecond,
    path: "/category/health-conditions",
  },
  {
    label: "Other",
    image: other,
    path: "/category/other",
  },
];

export default categoryData;
