import { IconButton } from "./IconButton";

export default {
  title: "UI/Icon Button",
  component: IconButton,
  args: {
    children: <span aria-hidden>🔔</span>,
  },
};

const Template = (args) => <IconButton {...args} />;

export const Ghost = Template.bind({});
Ghost.args = {
  variant: "ghost",
};

export const Primary = Template.bind({});
Primary.args = {
  variant: "primary",
};

export const Outline = Template.bind({});
Outline.args = {
  variant: "outline",
};
