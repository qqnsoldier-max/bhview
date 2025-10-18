import { forwardRef } from "react";
import styled, { css } from "styled-components";
// Styled anchor doubles as our left-nav item with active state treatment.
const StyledMenuLink = styled.a`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  color: ${({ theme }) => theme.colors.text.tertiary};
  text-decoration: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-weight: ${({ theme }) => theme.typography.weightMedium};
  letter-spacing: 0.01em;
  transition: ${({ theme }) => theme.transitions.base};
  position: relative;
  isolation: isolate;

  ${({ theme, $active }) =>
    $active
      ? css`
          color: ${theme.colors.text.primary};
          background: ${theme.gradients.primarySoft};
          box-shadow: inset 0 0 0 1px ${theme.colors.border.accent};
        `
      : css`
          &:hover {
            background: rgba(255, 255, 255, 0.06);
            color: ${theme.colors.text.secondary};
          }
        `}

  &::before {
    content: "";
    position: absolute;
    left: 8px;
    top: 10px;
    bottom: 10px;
    width: 3px;
    border-radius: ${({ theme }) => theme.radii.pill};
    background: ${({ theme }) => theme.colors.primary};
    opacity: ${({ $active }) => ($active ? 1 : 0)};
    transition: ${({ theme }) => theme.transitions.base};
  }
`;

export const MenuLink = forwardRef(({ icon, label, active = false, ...props }, ref) => (
  <StyledMenuLink ref={ref} $active={active} {...props}>
    {icon && <span aria-hidden>{icon}</span>}
    <span>{label}</span>
  </StyledMenuLink>
));

MenuLink.displayName = "MenuLink";
