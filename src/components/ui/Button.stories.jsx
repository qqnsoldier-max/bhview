import { Button } from "./Button";

export default {
  title: "UI/Button",
  component: Button,
  args: {
    children: "Execute Trade",
  },
  parameters: {
    layout: "centered",
  },
};

const Template = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  variant: "primary",
};

export const Secondary = Template.bind({});
Secondary.args = {
  variant: "secondary",
};

export const Outline = Template.bind({});
Outline.args = {
  variant: "outline",
};

export const Subtle = Template.bind({});
Subtle.args = {
  variant: "subtle",
};

export const Danger = Template.bind({});
Danger.args = {
  variant: "danger",
};

export const WithIcon = Template.bind({});
WithIcon.args = {
  variant: "primary",
  children: (
    <>
      <span aria-hidden>⚡</span>
      Quick Order
    </>
  ),
};
