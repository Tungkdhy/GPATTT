import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { Search, Filter, X, Calendar as CalendarIcon, RotateCcw, ChevronDown } from 'lucide-react';

export interface FilterOption {
  key: string;
  label: string;
  type: 'select' | 'date' | 'dateRange' | 'multiSelect';
  options?: { value: string; label: string }[];
}

interface AdvancedFilterProps {
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  filterOptions?: FilterOption[];
  filters: Record<string, any>;
  onFiltersChange: (filters: Record<string, any>) => void;
  onReset?: () => void;
}

export function AdvancedFilter({
  searchPlaceholder = "Tìm kiếm...",
  searchValue,
  onSearchChange,
  filterOptions = [],
  filters,
  onFiltersChange,
  onReset
}: AdvancedFilterProps) {
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [dateOpen, setDateOpen] = useState<string | null>(null);

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
          <Popover 
            open={dateOpen === option.key} 
            onOpenChange={(open:any) => setDateOpen(open ? option.key : null)}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal h-8"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {value ? value.toLocaleDateString('vi-VN') : `Chọn ${option.label.toLowerCase()}`}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="p-4 text-sm text-muted-foreground">
                Date picker temporarily disabled
              </div>
            </PopoverContent>
          </Popover>
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

      default:
        return null;
    }
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center space-x-2 flex-1">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="max-w-sm input-focus"
          />
        </div>
        
        <div className="flex items-center space-x-2">
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