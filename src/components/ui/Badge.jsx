import styled, { css } from "styled-components";

// Variant-driven micro-label for status and tag use cases.
const variants = (theme) => ({
  default: css`
    background: rgba(148, 163, 184, 0.16);
    color: ${theme.colors.text.primary};
  `,
  success: css`
    background: rgba(59, 207, 124, 0.16);
    color: ${theme.colors.status.success};
  `,
  warning: css`
    background: rgba(255, 179, 71, 0.14);
    color: ${theme.colors.status.warning};
  `,
  danger: css`
    background: rgba(255, 90, 95, 0.14);
    color: ${theme.colors.status.danger};
  `,
  accent: css`
    background: rgba(0, 209, 178, 0.14);
    color: ${theme.colors.accent};
  `,
});

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: 4px ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radii.pill};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-weight: ${({ theme }) => theme.typography.weightSemiBold};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  letter-spacing: 0.05em;
  text-transform: uppercase;
  ${({ theme, variant }) => {
    const styles = variants(theme);
    return styles[variant] || styles.default;
  }}
`;
