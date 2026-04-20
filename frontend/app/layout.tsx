import type { Metadata } from \"next\";
import \"./globals.css\";
import { AuthProvider } from \"@/lib/authContext\";

export const metadata: Metadata = {
  title: \"AlgoMortem \u2014 We don't fix your code. We dissect your thinking.\",
  description: \"The AI that never gives you the answer. Debug your logic, not your code.\",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang=\"en\" className=\"h-full\">
      <body className=\"min-h-dvh flex flex-col antialiased\">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
