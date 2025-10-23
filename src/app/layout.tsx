import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          position="top-left"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#303841", // --bg3
              color: "#ffffff", // --text1
              borderRadius: "8px",
              border: "1px solid #61656b", // --text2
              fontFamily: "Inter, sans-serif",
              fontSize: "20px",
              fontWeight: "500",
            },
            success: {
              duration: 3000,
              style: {
                background: "#303841", // --bg3
                color: "#ffffff", // --text1
              },
              iconTheme: {
                primary: "#fb0443", // --accent1 (your theme color)
                secondary: "#ffffff", // --text1
              },
            },
            error: {
              duration: 5000,
              style: {
                background: "#303841", // --bg3
                color: "#ffffff", // --text1
              },
              iconTheme: {
                primary: "#fb0443", // --accent1 (consistent with theme)
                secondary: "#ffffff", // --text1
              },
            },
          }}
        />
      </body>
    </html>
  );
}
