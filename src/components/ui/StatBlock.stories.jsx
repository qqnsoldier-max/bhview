import { StatBlock } from "./StatBlock";

export default {
  title: "UI/Stat Block",
  component: StatBlock,
  args: {
    label: "Equity Value",
    value: "$1.84M",
    trend: "+4.2%",
    trendDirection: "up",
    meta: "vs. last 24h",
  },
};

const Template = (args) => <StatBlock {...args} />;

export const Default = Template.bind({});

export const NegativeTrend = Template.bind({});
NegativeTrend.args = {
  value: "$1.62M",
  trend: "-1.3%",
  trendDirection: "down",
};
