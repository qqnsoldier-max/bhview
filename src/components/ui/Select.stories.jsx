import { Select } from "./Select";

const options = [
  { label: "Cash", value: "cash" },
  { label: "Equities", value: "equities" },
  { label: "FX", value: "fx" },
  { label: "Crypto", value: "crypto" },
];

export default {
  title: "UI/Select",
  component: Select,
  args: {
    id: "asset-type",
    label: "Asset Type",
    children: options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    )),
  },
};

const Template = (args) => <Select {...args} />;

export const Default = Template.bind({});
