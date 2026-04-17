import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import type { Product } from "@/lib/db/types";

const pushMock = vi.fn();
const mockSubmit = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    render,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
    render?: React.ReactElement;
  }) => {
    if (render) {
      return React.cloneElement(render, props, children);
    }
    return <button {...props}>{children}</button>;
  },
}));

vi.mock("@/components/ui/input", () => ({
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} />,
}));

vi.mock("@/components/ui/label", () => ({
  Label: ({ children, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) => (
    <label {...props}>{children}</label>
  ),
}));

const product: Product = {
  id: "p1",
  slug: "r34",
  name: "Nissan Skyline R34",
  brand: "Nissan",
  description: "Legendary build",
  images: ["/test.jpg"],
  price: 5000,
  status: "available",
  deliveryDays: 7,
  years: "1999-2002",
  specs: [],
  backgrounds: [],
};

describe("CheckoutForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
    HTMLFormElement.prototype.submit = mockSubmit;
  });

  it("shows validation errors for empty submit", async () => {
    render(<CheckoutForm product={product} slug="r34" background="Midnight" notes="" />);

    fireEvent.click(screen.getByRole("button", { name: /Proceed to Payment/i }));

    expect(await screen.findByText("Full name is required.")).toBeInTheDocument();
    expect(screen.getByText("Enter a valid email.")).toBeInTheDocument();
    expect(screen.getByText("Phone number is required.")).toBeInTheDocument();
    expect(screen.getByText("Delivery address is required.")).toBeInTheDocument();
    expect(screen.getByText("City is required.")).toBeInTheDocument();
  });

  it("shows API error on failed create order", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
      new Response(
        JSON.stringify({
          success: false,
          error: { message: "Order API failed." },
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    );

    render(<CheckoutForm product={product} slug="r34" background="Midnight" notes="" />);

    fireEvent.change(screen.getByLabelText("Full Name"), {
      target: { value: "Anas Altaf" },
    });
    fireEvent.change(screen.getByLabelText("Phone Number"), {
      target: { value: "123" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "anas@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Delivery Address"), {
      target: { value: "address" },
    });
    fireEvent.change(screen.getByLabelText("City"), {
      target: { value: "Lahore" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Proceed to Payment/i }));

    expect(await screen.findByText("Order API failed.")).toBeInTheDocument();
  });

  it("redirects to secured order page when PayFast is unavailable", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          data: {
            order: { id: "order-1" },
            orderAccessToken: "token-123",
          },
        }),
        { status: 201, headers: { "Content-Type": "application/json" } }
      )
    );

    render(<CheckoutForm product={product} slug="r34" background="Midnight" notes="" />);

    fireEvent.change(screen.getByLabelText("Full Name"), {
      target: { value: "Anas Altaf" },
    });
    fireEvent.change(screen.getByLabelText("Phone Number"), {
      target: { value: "123" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "anas@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Delivery Address"), {
      target: { value: "address" },
    });
    fireEvent.change(screen.getByLabelText("City"), {
      target: { value: "Lahore" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Proceed to Payment/i }));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/order/order-1?token=token-123");
    });
  });

  it("submits hidden form when PayFast payload exists", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          data: {
            order: { id: "order-1" },
            payfastUrl: "https://sandbox.payfast.co.za/eng/process",
            payfastData: {
              signature: "sig",
              amount: "5000.00",
            },
          },
        }),
        { status: 201, headers: { "Content-Type": "application/json" } }
      )
    );

    render(<CheckoutForm product={product} slug="r34" background="Midnight" notes="" />);

    fireEvent.change(screen.getByLabelText("Full Name"), {
      target: { value: "Anas Altaf" },
    });
    fireEvent.change(screen.getByLabelText("Phone Number"), {
      target: { value: "123" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "anas@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Delivery Address"), {
      target: { value: "address" },
    });
    fireEvent.change(screen.getByLabelText("City"), {
      target: { value: "Lahore" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Proceed to Payment/i }));

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalled();
    });
  });
});
