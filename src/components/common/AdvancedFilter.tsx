import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { Search, Filter, X, ChevronDown } from 'lucide-react';

export interface FilterOption {
  key: string;
  label: string;
  type: 'select' | 'date' | 'dateRange' | 'multiSelect' | 'text';
  options?: { value: string; label: string }[];
  placeholder?: string;
}

interface AdvancedFilterProps {
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  filterOptions?: FilterOption[];
  filters: Record<string, any>;
  onFiltersChange: (filters: Record<string, any>) => void;
  onReset?: () => void;
}

export function AdvancedFilter({
  searchPlaceholder,
  searchValue,
  onSearchChange,
  filterOptions = [],
  filters,
  onFiltersChange,
  onReset
}: AdvancedFilterProps) {
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    if (value === undefined || value === null || value === '' || value === '__all__') {
      delete newFilters[key];
    }
    onFiltersChange(newFilters);
  };

  const handleReset = () => {
    onFiltersChange({});
    if (onReset) onReset();
  };

  const getActiveFiltersCount = () => {
    return Object.keys(filters).filter(key => {
      const value = filters[key];
      return value !== undefined && value !== null && value !== '' && value !== '__all__';
    }).length;
  };

  const renderFilterInput = (option: FilterOption) => {
    const value = filters[option.key];

    switch (option.type) {
      case 'select':
        return (
          <Select
            value={value || '__all__'}
            onValueChange={(newValue:any) => handleFilterChange(option.key, newValue === '__all__' ? undefined : newValue)}
          >
            <SelectTrigger className="h-8">
              <SelectValue placeholder={`Chọn ${option.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">Tất cả</SelectItem>
              {option.options?.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'date':
        return (
          <div className="relative group">
            <Input
              type="date"
              placeholder={option.placeholder || `Chọn ${option.label.toLowerCase()}`}
              value={value || ''}
              onChange={(e) => handleFilterChange(option.key, e.target.value)}
              className="h-8 w-full bg-muted/50 border-muted-foreground/20 text-foreground w-full placeholder:text-muted-foreground/60 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200 hover:border-muted-foreground/40 cursor-pointer"
              style={{
                colorScheme: 'dark',
                WebkitAppearance: 'none',
                MozAppearance: 'textfield'
              }}
            />
           
          </div>
        );

      case 'multiSelect':
        const selectedValues = value || [];
        return (
          <div className="space-y-2">
            <Select
              onValueChange={(newValue:any) => {
                if (!selectedValues.includes(newValue)) {
                  handleFilterChange(option.key, [...selectedValues, newValue]);
                }
              }}
            >
              <SelectTrigger className="h-8">
                <SelectValue placeholder={`Chọn ${option.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {option.options?.filter(opt => !selectedValues.includes(opt.value)).map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedValues.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {selectedValues.map((val: string) => {
                  const optLabel = option.options?.find(opt => opt.value === val)?.label || val;
                  return (
                    <Badge key={val} variant="secondary" className="text-xs">
                      {optLabel}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                        onClick={() => {
                          const newValues = selectedValues.filter((v: string) => v !== val);
                          handleFilterChange(option.key, newValues.length > 0 ? newValues : undefined);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>
        );

      case 'text':
        return (
          <Input
            placeholder={option.placeholder || `Nhập ${option.label.toLowerCase()}`}
            value={value || ''}
            onChange={(e) => handleFilterChange(option.key, e.target.value)}
            className="h-8"
          />
        );

      default:
        return null;
    }
  };

  const activeFiltersCount = getActiveFiltersCount();
  const showSearch = searchPlaceholder !== undefined && searchValue !== undefined && onSearchChange !== undefined;

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex items-center justify-between gap-4">
        {showSearch && (
          <div className="flex items-center space-x-2 flex-1">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange!(e.target.value)}
              className="max-w-sm input-focus"
            />
          </div>
        )}
        
        <div className={`flex items-center space-x-2 ${showSearch ? '' : 'ml-auto'}`}>
          {filterOptions.length > 0 && (
            <Popover open={showAdvancedFilter} onOpenChange={setShowAdvancedFilter}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="relative btn-animate scale-hover">
                  <Filter className="h-4 w-4 mr-2" />
                  Bộ lọc
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs badge-bounce">
                      {activeFiltersCount}
                    </Badge>
                  )}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Bộ lọc nâng cao</h4>
                    {activeFiltersCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleReset}
                        className="h-8 px-2"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Xóa tất cả
                      </Button>
                    )}
                  </div>
                  <Separator />
                  
                  {filterOptions.map((option) => (
                    <div key={option.key} className="space-y-2">
                      <Label className="text-sm font-medium">{option.label}</Label>
                      {renderFilterInput(option)}
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </div>
  );
}