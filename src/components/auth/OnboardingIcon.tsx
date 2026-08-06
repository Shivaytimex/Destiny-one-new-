import type { ComponentType } from "react";

export default function OnboardingIcon({ icon: Icon, size = "medium", label }: { icon: ComponentType; size?: string; label?: string }) {
  return (
    <span
      className={`onboarding-icon onboarding-icon-${size}`}
      aria-label={label}
      aria-hidden={label ? undefined : "true"}
    >
      <span className="onboarding-icon-orb">
        <Icon />
      </span>
    </span>
  );
}
