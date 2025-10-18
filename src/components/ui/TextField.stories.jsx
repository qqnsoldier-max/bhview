import { TextField } from "./TextField";

export default {
  title: "UI/Text Field",
  component: TextField,
  args: {
    id: "account-id",
    label: "Account ID",
    placeholder: "Enter identifier",
  },
};

const Template = (args) => <TextField {...args} />;

export const Default = Template.bind({});

export const WithHelper = Template.bind({});
WithHelper.args = {
  helperText: "Example: 1a2b3c",
};

export const WithError = Template.bind({});
WithError.args = {
  error: true,
  helperText: "ID is required",
};
