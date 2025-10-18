import { MenuLink } from "./MenuLink";

export default {
  title: "UI/Menu Link",
  component: MenuLink,
  args: {
    label: "Overview",
    href: "#",
  },
  parameters: {
    backgrounds: {
      default: "Surface",
    },
  },
};

const Template = (args) => <MenuLink {...args} />;

export const Default = Template.bind({});

export const Active = Template.bind({});
Active.args = {
  active: true,
};
