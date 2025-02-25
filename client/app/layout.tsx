import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";
import { Provider } from "../components/ui/provider";
import ReactQueryProvider from "../utils/ReactQueryProvider";
import { Toaster } from "../components/ui/toaster";
import { AuthProvider } from "../context/AuthContext";
import { SocketProvider } from "../context/SocketContext";
const raleway = Raleway({ subsets: ["latin"], variable: "--font-raleway" });

export const metadata: Metadata = {
  title: "Chat App",
  description: "A simple chat app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${raleway.className}`}>
        <AuthProvider>
          <Provider>
            <Toaster />
            <ReactQueryProvider>
              <SocketProvider>{children}</SocketProvider>
            </ReactQueryProvider>
          </Provider>
        </AuthProvider>
      </body>
    </html>
  );
}
