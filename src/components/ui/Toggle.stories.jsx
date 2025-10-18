import { useState } from "react";
import { Toggle } from "./Toggle";

export default {
  title: "UI/Toggle",
  component: Toggle,
  args: {
    label: "Live Mode",
  },
};

const Template = (args) => {
  const [checked, setChecked] = useState(true);
  return <Toggle {...args} checked={checked} onChange={(event) => setChecked(event.target.checked)} />;
};

export const Default = Template.bind({});
