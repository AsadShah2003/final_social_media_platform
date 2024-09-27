import {
  Inter,
  Roboto,
  Abril_Fatface,
  Poppins,
  Raleway,
} from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
});
const raleway = Raleway({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
});
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
});
const lora = Poppins({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
});
const abril = Abril_Fatface({
  subsets: ["latin"],
  weight: ["400"],
});
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700"],
});

export { inter, roboto, abril, poppins, lora, raleway };
