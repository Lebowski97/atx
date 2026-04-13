import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle, MessageCircle } from "lucide-react";

export default function ConfirmationPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-8">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="flex justify-center">
          <Image
            src="/name_logo.png"
            alt="Tiny Trees ATX logo"
            width={120}
            height={120}
            className="drop-shadow-lg"
          />
        </div>

        <div className="flex justify-center">
          <CheckCircle className="h-16 w-16 text-green-400" />
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-light tracking-wide">Thank You!</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Your order has been received successfully.
          </p>
          <p className="text-muted-foreground">
            We&apos;ll be in touch soon with updates on your order.
          </p>
        </div>

        <div className="space-y-3 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Have questions or concerns?
          </p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-sm text-muted-foreground">
              Text us on Signal
            </span>
            <MessageCircle className="h-4 w-4 text-foreground" />
            <span className="text-base font-bold text-foreground">
              tinytreesatx.89
            </span>
          </div>
        </div>

        <div className="pt-8">
          <Button variant="secondary" className="font-medium px-8 py-3" asChild>
            <Link href="/menu">Back to Menu</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
