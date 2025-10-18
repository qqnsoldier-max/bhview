import styled from "styled-components";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { Card, CardBody, CardHeader, CardSubtitle, CardTitle } from "./Card";

const Placeholder = styled.div`
  height: 200px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px dashed ${({ theme }) => theme.colors.border.subtle};
  background: rgba(255, 255, 255, 0.04);
`;

export default {
  title: "UI/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
};

export const PerformanceCard = () => (
  <Card>
    <CardHeader>
      <div>
        <CardTitle>Performance Overview</CardTitle>
        <CardSubtitle>Strategy blend across equities, FX, and crypto</CardSubtitle>
      </div>
      <Badge variant="default">Last 30 days</Badge>
    </CardHeader>
    <CardBody>
      <Placeholder aria-hidden />
    </CardBody>
  </Card>
);

export const WatchlistCard = () => (
  <Card>
    <CardHeader>
      <div>
        <CardTitle>Active Watchlist</CardTitle>
        <CardSubtitle>Signals refresh every 15 seconds</CardSubtitle>
      </div>
      <Button variant="subtle" size="sm">
        Manage
      </Button>
    </CardHeader>
    <CardBody>
      <Placeholder aria-hidden />
    </CardBody>
  </Card>
);
