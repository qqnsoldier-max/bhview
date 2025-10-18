import { Badge } from "./Badge";

export default {
  title: "UI/Badge",
  component: Badge,
  args: {
    children: "Active",
  },
};

const Template = (args) => <Badge {...args} />;

export const Default = Template.bind({});

export const Success = Template.bind({});
Success.args = {
  variant: "success",
  children: "Gain",
};

export const Warning = Template.bind({});
Warning.args = {
  variant: "warning",
  children: "Pending",
};

export const Danger = Template.bind({});
Danger.args = {
  variant: "danger",
  children: "Drawdown",
};

export const Accent = Template.bind({});
Accent.args = {
  variant: "accent",
  children: "Premium",
};
