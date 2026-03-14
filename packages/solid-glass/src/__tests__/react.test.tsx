import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import React from "react";
import { Glass } from "../react/Glass";

afterEach(cleanup);

describe("Glass component", () => {
  it("renders children", () => {
    const { getByText } = render(
      <Glass>
        <span>Hello Glass</span>
      </Glass>
    );
    expect(getByText("Hello Glass")).toBeInTheDocument();
  });

  it("applies the correct template className", () => {
    const { container } = render(<Glass template="frosted" />);
    expect(container.firstChild).toHaveClass("sg-frosted");
  });

  it("defaults to frosted template", () => {
    const { container } = render(<Glass />);
    expect(container.firstChild).toHaveClass("sg-frosted");
  });

  it("applies flat CSS variables", () => {
    const { container } = render(
      <Glass blur={20} borderRadius={32} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.getPropertyValue("--sg-blur")).toBe("20px");
    expect(el.style.getPropertyValue("--sg-radius")).toBe("32px");
  });

  it("merges user className", () => {
    const { container } = render(<Glass className="my-custom" />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain("sg-frosted");
    expect(el.className).toContain("my-custom");
  });

  it("merges user style", () => {
    const { container } = render(
      <Glass style={{ padding: "10px" }} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.padding).toBe("10px");
    expect(el.style.getPropertyValue("--sg-blur")).toBeTruthy();
  });

  it("renders as div by default", () => {
    const { container } = render(<Glass />);
    expect(container.firstChild?.nodeName).toBe("DIV");
  });

  it("renders as a different tag via `as` prop", () => {
    const { container } = render(<Glass as="section" />);
    expect(container.firstChild?.nodeName).toBe("SECTION");
  });

  it("works with all template types", () => {
    const templateNames = ["frosted", "crystal", "aurora", "smoke", "prism", "holographic", "thin"] as const;
    for (const template of templateNames) {
      const { container, unmount } = render(<Glass template={template} />);
      const el = container.firstChild as HTMLElement;
      expect(el.className).toContain(`sg-${template}`);
      unmount();
    }
  });

  it("works with named presets", () => {
    const { container } = render(<Glass template="frostedDark" />);
    expect(container.firstChild).toHaveClass("sg-frosted");
    const el = container.firstChild as HTMLElement;
    expect(el.style.getPropertyValue("--sg-blur")).toBe("14px");
  });

  it("injects SVG filter for crystal template", () => {
    render(<Glass template="crystal" />);
    const svgs = document.querySelectorAll("svg");
    const crystalSvg = Array.from(svgs).find((svg) => {
      const filter = svg.querySelector("filter");
      return filter?.id?.startsWith("sg-crystal");
    });
    expect(crystalSvg).toBeTruthy();
  });

  it("cleans up SVG filter on unmount", () => {
    const { unmount } = render(<Glass template="crystal" />);
    const before = document.querySelectorAll('filter[id^="sg-crystal"]').length;
    expect(before).toBeGreaterThan(0);
    unmount();
    const after = document.querySelectorAll('filter[id^="sg-crystal"]').length;
    expect(after).toBe(0);
  });

  it("forwards ref", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Glass ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current?.className).toContain("sg-frosted");
  });

  it("passes through extra HTML attributes", () => {
    const { container } = render(
      <Glass data-testid="glass-el" role="region" />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.getAttribute("data-testid")).toBe("glass-el");
    expect(el.getAttribute("role")).toBe("region");
  });

  it("applies animation controls", () => {
    const { container } = render(
      <Glass template="aurora" paused bounciness={0.5} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.getPropertyValue("--sg-animation-state")).toBe("paused");
    expect(el.style.getPropertyValue("--sg-animation-easing")).toContain("cubic-bezier");
  });
});
