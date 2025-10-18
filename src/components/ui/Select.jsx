import { forwardRef } from "react";
import styled from "styled-components";
// Container mirrors TextField structure for consistent form spacing.
const SelectWrapper = styled.label`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

// Custom arrow maintains styling within the dark UI theme.
const SelectField = styled.select`
  appearance: none;
  background: rgba(12, 18, 38, 0.82);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg} ${theme.spacing.sm} ${theme.spacing.md}`};
  font-size: ${({ theme }) => theme.typography.sizes.base};
  color: ${({ theme }) => theme.colors.text.primary};
  transition: ${({ theme }) => theme.transitions.base};
  outline: none;
  background-image: linear-gradient(45deg, transparent 50%, ${({ theme }) => theme.colors.neutral400} 50%),
    linear-gradient(135deg, ${({ theme }) => theme.colors.neutral400} 50%, transparent 50%);
  background-position: calc(100% - 18px) calc(50% - 3px), calc(100% - 12px) calc(50% - 3px);
  background-size: 6px 6px;
  background-repeat: no-repeat;

  &:focus {
    border-color: rgba(63, 140, 255, 0.6);
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.focus};
  }
`;

export const Select = forwardRef(({ label, id, children, ...props }, ref) => (
  <SelectWrapper htmlFor={id}>
    {label}
    <SelectField ref={ref} id={id} {...props}>
      {children}
    </SelectField>
  </SelectWrapper>
));

Select.displayName = "Select";
