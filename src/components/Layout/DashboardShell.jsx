import { useState } from "react";
import styled from "styled-components";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardSubtitle,
  CardTitle,
  MenuLink,
  StatBlock,
  Toggle,
} from "../ui";

// Two-column grid sets up the persistent sidebar layout.
const Shell = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-columns: ${({ theme }) => `${theme.layout.sidebarWidth} minmax(0, 1fr)`};
  background: linear-gradient(160deg, rgba(17, 23, 42, 0.6), rgba(17, 23, 42, 0.92));
`;

// Sidebar hosts brand, navigation, and upsell messaging.
const Sidebar = styled.aside`
  padding: ${({ theme }) => theme.spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
  border-right: 1px solid ${({ theme }) => theme.colors.border.subtle};
  background: linear-gradient(140deg, rgba(12, 20, 42, 0.95), rgba(9, 14, 34, 0.75));
`;

const Brand = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const BrandMark = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.gradients.primary};
  font-weight: ${({ theme }) => theme.typography.weightSemiBold};
  font-size: 1.2rem;
  letter-spacing: 0.12em;
`;

const BrandLabel = styled.span`
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.28em;
  color: ${({ theme }) => theme.colors.neutral400};
`;

const NavSection = styled.nav`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const SectionLabel = styled.span`
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: ${({ theme }) => theme.colors.neutral600};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const SidebarFooter = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

// Main area contains actionable insights and data visualizations.
const Main = styled.main`
  padding: ${({ theme }) => theme.spacing.xl};
  display: grid;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const TopBar = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const TopBarLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const TopBarTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  letter-spacing: -0.01em;
`;

const TopBarMeta = styled.p`
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-size: ${({ theme }) => theme.typography.sizes.base};
`;

const TopBarActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

// KPI strip scales responsively across devices.
const StatsGrid = styled.section`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
`;

const CardsGrid = styled.section`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
`;

// Placeholder settles spacing until charts are wired in.
const ChartPlaceholder = styled.div`
  height: 200px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px dashed rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
`;

const TablePlaceholder = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.subtle};
  &:last-of-type {
    border-bottom: none;
  }
`;

// Menu configuration will later be driven by routing metadata.
const menuItems = [
  { label: "Overview", active: true },
  { label: "Portfolio" },
  { label: "Markets" },
  { label: "Trade" },
  { label: "Analytics" },
];

// Temporary watchlist entries emulate live market data.
const watchlistMock = [
  { symbol: "BHV", change: "+2.81%", status: "success" },
  { symbol: "ALPHA", change: "-1.13%", status: "danger" },
  { symbol: "XBT", change: "+5.92%", status: "success" },
];

export const DashboardShell = () => {
  const [liveMode, setLiveMode] = useState(true);

  return (
    <Shell>
      <Sidebar>
        <Brand>
          <BrandMark>BHV</BrandMark>
          <BrandLabel>Markets</BrandLabel>
        </Brand>

        <div>
          <SectionLabel>Main</SectionLabel>
          <NavSection>
            {menuItems.map((item) => (
              <MenuLink key={item.label} label={item.label} href="#" active={item.active} />
            ))}
          </NavSection>
        </div>

        <SidebarFooter>
          <Badge variant="accent">Premium</Badge>
          <p>Upgrade your account for deeper analytics, white-labeled reporting, and advanced signals.</p>
          <Button variant="secondary">Upgrade Plan</Button>
        </SidebarFooter>
      </Sidebar>

      <Main>
        <TopBar>
          <TopBarLeft>
            <TopBarTitle>Dashboard</TopBarTitle>
            <TopBarMeta>Curated insights across your multi-asset holdings</TopBarMeta>
          </TopBarLeft>
          <TopBarActions>
            <Toggle
              checked={liveMode}
              onChange={(event) => setLiveMode(event.target.checked)}
              label="Live mode"
            />
            <Button>New Order</Button>
          </TopBarActions>
        </TopBar>

        <StatsGrid>
          <StatBlock label="Equity Value" value="$1.84M" trend="+4.2%" trendDirection="up" meta="vs. last 24h" />
          <StatBlock label="Daily P/L" value="+$38.5K" trend="+1.8%" trendDirection="up" meta="Across all strategies" />
          <StatBlock label="Risk Utilization" value="42%" trend="-3.5%" trendDirection="down" meta="of available margin" />
          <StatBlock label="Win Rate" value="67%" trend="+2.1%" trendDirection="up" meta="Last 30 days" />
        </StatsGrid>

        <CardsGrid>
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Performance Overview</CardTitle>
                <CardSubtitle>Strategy blend across equities, FX, and crypto</CardSubtitle>
              </div>
              <Badge variant="default">Last 30 days</Badge>
            </CardHeader>
            <CardBody>
              <ChartPlaceholder aria-hidden />
            </CardBody>
          </Card>

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
              <TablePlaceholder>
                {watchlistMock.map((item) => (
                  <TableRow key={item.symbol}>
                    <span>{item.symbol}</span>
                    <Badge variant={item.status}>{item.change}</Badge>
                    <Button variant="outline" size="sm">
                      Trade
                    </Button>
                  </TableRow>
                ))}
              </TablePlaceholder>
            </CardBody>
          </Card>
        </CardsGrid>
      </Main>
    </Shell>
  );
};

export default DashboardShell;
