import { useMemo, useState } from "react";
import styled, { useTheme } from "styled-components";
import {
  Button,
  IconButton,
  MenuLink,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardSubtitle,
  TextField,
  Select,
  Toggle,
  Badge,
  StatBlock,
} from "../components/ui";
import { useThemePicker } from "../theme/ThemeContext";

// UiGallery surfaces UI primitives so designers and engineers can regression-check states quickly.
const Page = styled.div`
  display: grid;
  gap: 24px;
  padding: 24px;
`;

const Section = styled.section`
  display: grid;
  gap: 16px;
`;

const H = styled.h2`
  margin: 0;
  font-size: 0.95rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
`;

const Grid = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
`;

const SwatchGrid = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
`;

const Swatch = styled.div`
  display: grid;
  grid-template-columns: 48px 1fr;
  gap: 12px;
  align-items: center;
  background: ${({ theme }) => theme.colors.backgrounds.soft};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 12px;
  padding: 8px 12px;
`;

const ColorBox = styled.div`
  width: 48px;
  height: 32px;
  border-radius: 8px;
  background: ${(props) => props.$color};
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.2);
`;

const Label = styled.div`
  display: grid;
  gap: 4px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  span.value {
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

const EmptySwatchNotice = styled.span`
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const PlaceholderCopy = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

export default function UiGallery() {
  const [checked, setChecked] = useState(true);
  const theme = useTheme();
  const { paletteName, setPalette, options } = useThemePicker();

  const colorSwatches = useMemo(() => collectColorEntries(theme?.colors), [theme]);

  const currentLabel = options.find((option) => option.value === paletteName)?.label ?? paletteName;

  return (
    <Page>
      <Section>
        <H>Theme</H>
        <Row>
          <Select
            id="theme-picker"
            label="Palette"
            value={paletteName}
            onChange={(event) => setPalette(event.target.value)}
            style={{ minWidth: 220 }}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <Badge variant="accent">{currentLabel}</Badge>
        </Row>
      </Section>

      <Section>
        <H>Buttons</H>
        <Row>
          <Button size="sm">Primary sm</Button>
          <Button size="md">Primary md</Button>
          <Button size="lg">Primary lg</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="subtle">Subtle</Button>
          <Button variant="danger">Danger</Button>
          <Button icon="🚀">With icon</Button>
        </Row>
      </Section>

      <Section>
        <H>Icon Buttons</H>
        <Row>
          <IconButton size="xs" variant="ghost" aria-label="menu">
            ☰
          </IconButton>
          <IconButton size="sm" variant="ghost" aria-label="bell">
            🔔
          </IconButton>
          <IconButton size="md" variant="ghost" aria-label="user">
            👤
          </IconButton>
          <IconButton size="sm" variant="primary" aria-label="ok">
            ✓
          </IconButton>
          <IconButton size="sm" variant="outline" aria-label="info">
            i
          </IconButton>
          <IconButton size="sm" disabled aria-label="disabled">
            ×
          </IconButton>
        </Row>
      </Section>

      <Section>
        <H>Badges</H>
        <Row>
          <Badge>Default</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">Danger</Badge>
          <Badge variant="accent">Accent</Badge>
        </Row>
      </Section>

      <Section>
        <H>Text Fields</H>
        <Grid>
          <TextField id="tf1" label="Label" placeholder="Placeholder" />
          <TextField id="tf2" label="With helper" placeholder="Search..." helperText="Helpful hint" />
          <TextField
            id="tf3"
            label="Error"
            placeholder="Type..."
            error
            helperText="This field is required"
          />
          <TextField id="tf4" type="password" label="Password" placeholder="••••••••" />
          <TextField id="tf5" type="number" label="Quantity" placeholder="100" />
        </Grid>
      </Section>

      <Section>
        <H>Selects</H>
        <Row>
          <Select id="sel1" label="Asset Class" defaultValue="all" style={{ minWidth: 220 }}>
            <option value="all">All</option>
            <option value="equities">Equities</option>
            <option value="crypto">Crypto</option>
            <option value="fx">FX</option>
          </Select>
          <Select id="sel2" label="Order Type" defaultValue="market" style={{ minWidth: 220 }}>
            <option value="market">Market</option>
            <option value="limit">Limit</option>
            <option value="stop">Stop</option>
          </Select>
        </Row>
      </Section>

      <Section>
        <H>Toggle</H>
        <Row>
          <Toggle checked={checked} onChange={(event) => setChecked(event.target.checked)} label="Realtime updates" />
          <Toggle checked readOnly label="Read-only ON" />
          <Toggle checked={false} readOnly label="Read-only OFF" />
        </Row>
      </Section>

      <Section>
        <H>Menu Links</H>
        <Row>
          <MenuLink href="#" label="Dashboard" icon={<span>🏠</span>} active />
          <MenuLink href="#" label="Markets" icon={<span>📈</span>} />
          <MenuLink href="#" label="Orders" icon={<span>🧾</span>} />
        </Row>
      </Section>

      <Section>
        <H>Cards</H>
        <Grid>
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Card Title</CardTitle>
                <CardSubtitle>Optional subtitle text</CardSubtitle>
              </div>
              <Button size="sm" variant="outline">
                Action
              </Button>
            </CardHeader>
            <CardBody>
              <PlaceholderCard />
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Simple Card</CardTitle>
            </CardHeader>
            <CardBody>
              <PlaceholderCopy>
                Use Card, CardHeader, CardTitle, CardSubtitle, and CardBody to compose.
              </PlaceholderCopy>
            </CardBody>
          </Card>
        </Grid>
      </Section>

      <Section>
        <H>Stat Blocks</H>
        <Grid>
          <StatBlock label="Equity" value="$124,532" trend="+2.1%" trendDirection="up" meta="Today" />
          <StatBlock label="PnL (Daily)" value="+$1,432" trend="+1.16%" trendDirection="up" />
          <StatBlock label="Open Positions" value="8" meta="3 green / 5 red" />
          <StatBlock label="Orders (Today)" value="24" trend="-3" trendDirection="down" />
        </Grid>
      </Section>

      <Section>
        <H>Color Tokens</H>
        <SwatchGrid>
          {colorSwatches.length > 0 ? (
            colorSwatches.map(({ name, value }) => (
              <Swatch key={name}>
                <ColorBox $color={value} />
                <Label>
                  <div>{name}</div>
                  <span className="value">{value}</span>
                </Label>
              </Swatch>
            ))
          ) : (
            <EmptySwatchNotice>Add palette colors to show swatches</EmptySwatchNotice>
          )}
        </SwatchGrid>
      </Section>
    </Page>
  );
}

const PlaceholderCard = styled.div`
  height: 160px;
  border-radius: 12px;
  background: ${({ theme }) => theme.gradients.primarySoft};
  box-shadow: inset 0 0 0 1px ${({ theme }) => theme.colors.border.subtle};
`;

function collectColorEntries(colors, prefix = []) {
  if (!colors || typeof colors !== "object") {
    return [];
  }

  return Object.entries(colors).flatMap(([key, value]) => {
    const path = [...prefix, key];

    if (typeof value === "string") {
      return [{ name: path.join("."), value }];
    }

    if (value && typeof value === "object") {
      return collectColorEntries(value, path);
    }

    return [];
  });
}
