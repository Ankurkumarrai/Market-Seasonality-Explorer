import { Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const ThemeSelector = ({ colorScheme, setColorScheme }) => {
  const themes = [
    { value: 'default', label: 'Default', description: 'Standard color scheme' },
    { value: 'high-contrast', label: 'High Contrast', description: 'Enhanced visibility' },
    { value: 'colorblind', label: 'Colorblind Friendly', description: 'Alternative color palette' },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Palette className="h-4 w-4" />
          Theme
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((theme) => (
          <DropdownMenuItem
            key={theme.value}
            onClick={() => setColorScheme(theme.value)}
            className={colorScheme === theme.value ? 'bg-primary/10' : ''}
          >
            <div>
              <div className="font-medium">{theme.label}</div>
              <div className="text-xs text-muted-foreground">{theme.description}</div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSelector;