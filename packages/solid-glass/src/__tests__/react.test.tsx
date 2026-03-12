import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import React from "react";
import { Glass } from "../react/Glass";

afterEach(cleanup);

describe("Glass component", () => {
  it("renders children", () => {
    const { getByText } = render(
      <Glass effect="frosted">
        <span>Hello Glass</span>
      </Glass>
    );
    expect(getByText("Hello Glass")).toBeInTheDocument();
  });

  it("applies the correct effect className", () => {
    const { container } = render(<Glass effect="frosted" />);
    expect(container.firstChild).toHaveClass("sg-frosted");
  });

  it("applies CSS variables as inline styles", () => {
    const { container } = render(
      <Glass effect="frosted" options={{ blur: 20, borderRadius: 32 }} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.getPropertyValue("--sg-blur")).toBe("20px");
    expect(el.style.getPropertyValue("--sg-radius")).toBe("32px");
  });

  it("merges user className", () => {
    const { container } = render(<Glass effect="frosted" className="my-custom" />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain("sg-frosted");
    expect(el.className).toContain("my-custom");
  });

  it("merges user style", () => {
    const { container } = render(
      <Glass effect="frosted" style={{ padding: "10px" }} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.padding).toBe("10px");
    // Also has CSS vars
    expect(el.style.getPropertyValue("--sg-blur")).toBeTruthy();
  });

  it("renders as div by default", () => {
    const { container } = render(<Glass effect="frosted" />);
    expect(container.firstChild?.nodeName).toBe("DIV");
  });

  it("renders as a different tag via `as` prop", () => {
    const { container } = render(<Glass effect="frosted" as="section" />);
    expect(container.firstChild?.nodeName).toBe("SECTION");
  });

  it("applies shorthand blur prop", () => {
    const { container } = render(<Glass effect="frosted" blur={24} />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.getPropertyValue("--sg-blur")).toBe("24px");
  });

  it("applies shorthand radius prop", () => {
    const { container } = render(<Glass effect="frosted" radius={40} />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.getPropertyValue("--sg-radius")).toBe("40px");
  });

  it("works with all effect types", () => {
    const effectNames = ["frosted", "crystal", "aurora", "smoke", "prism", "holographic", "thin"] as const;
    for (const effect of effectNames) {
      const { container, unmount } = render(<Glass effect={effect} />);
      const el = container.firstChild as HTMLElement;
      expect(el.className).toContain(`sg-${effect}`);
      unmount();
    }
  });

  it("injects SVG filter for crystal effect", () => {
    render(<Glass effect="crystal" />);
    const svgs = document.querySelectorAll("svg");
    const crystalSvg = Array.from(svgs).find((svg) => {
      const filter = svg.querySelector("filter");
      return filter?.id?.startsWith("sg-crystal");
    });
    expect(crystalSvg).toBeTruthy();
  });

  it("cleans up SVG filter on unmount", () => {
    const { unmount } = render(<Glass effect="crystal" />);
    const before = document.querySelectorAll('filter[id^="sg-crystal"]').length;
    expect(before).toBeGreaterThan(0);
    unmount();
    const after = document.querySelectorAll('filter[id^="sg-crystal"]').length;
    expect(after).toBe(0);
  });

  it("forwards ref", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Glass effect="frosted" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current?.className).toContain("sg-frosted");
  });

  it("passes through extra HTML attributes", () => {
    const { container } = render(
      <Glass effect="frosted" data-testid="glass-el" role="region" />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.getAttribute("data-testid")).toBe("glass-el");
    expect(el.getAttribute("role")).toBe("region");
  });
});
