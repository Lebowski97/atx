import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle, MessageCircle } from "lucide-react";

export default function ConfirmationPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-8">
      <div className="w-full max-w-md space-y-8 text-center">
        {/* Logo */}
        <div className="flex justify-center">
          <Image
            src="/name_logo.png"
            alt="Tiny Trees ATX logo"
            width={120}
            height={120}
            className="drop-shadow-lg"
          />
        </div>

        {/* Success Icon */}
        <div className="flex justify-center">
          <CheckCircle className="w-16 h-16 text-green-400" />
        </div>

        {/* Thank You Message */}
        <div className="space-y-4">
          <h1 className="text-3xl font-light tracking-wide">Thank You!</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Your order has been received successfully.
          </p>
          <p className="text-muted-foreground">
            We&apos;ll be in touch soon with updates on your order.
          </p>
        </div>

        {/* Contact Information */}
        <div className="space-y-4 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Have questions or concerns?
          </p>
          <div className="flex items-center justify-center space-x-2 text-foreground">
            <p>Text us on SIGNAL:</p>
            <MessageCircle className="w-4 h-4" />
            <p className="hover:text-muted-foreground transition-colors underline">
              tinytreesatx.89
            </p>
          </div>
        </div>

        {/* Back to Menu Button */}
        <div className="pt-8">
          <Link href="/menu">
            <Button variant="secondary" className="font-medium px-8 py-3">
              Back to Menu
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
