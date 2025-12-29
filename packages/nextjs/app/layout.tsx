import "@rainbow-me/rainbowkit/styles.css";
import { DappWrapperWithProviders } from "~~/components/DappWrapperWithProviders";
import { ThemeProvider } from "~~/components/ThemeProvider";
import "~~/styles/globals.css";
import { getMetadata } from "~~/utils/helper/getMetadata";
import Script from "next/script";

// Disable static generation for all pages due to client-side Wagmi dependencies
export const revalidate = false;
export const dynamic = "force-dynamic";

export const metadata = getMetadata({
  title: "Zama FHE · 塔罗神谕",
  description: "使用 Zama FHEVM 链上占卜，水晶球即点即得启示。",
  imageRelativePath: "/3612166.png",
});

const DappWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning className={``}>
      <head>
        <link href="https://api.fontshare.com/v2/css?f[]=telegraf@400,500,700&display=swap" rel="stylesheet" />
        <Script src="https://cdn.zama.org/relayer-sdk-js/0.3.0-5/relayer-sdk-js.umd.cjs" strategy="beforeInteractive" />
      </head>
      <body>
        <DappWrapperWithProviders>
          <ThemeProvider enableSystem>{children}</ThemeProvider>
        </DappWrapperWithProviders>
      </body>
    </html>
  );
};

export default DappWrapper;
