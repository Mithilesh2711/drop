export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: string;
  address: string;
  pincode: string;
  country: string;
  state: string;
  district: string;
  latitude: string;
  longitude: string;
  [key: string]: any;
}

export interface LocationDetails {
  country: string;
  state: string;
  district: string;
  latitude: string;
  longitude: string;
}

export interface MapLocation {
  lat: number;
  lng: number;
}

export interface MapComponentProps {
  onLocationSelect: (details: LocationDetails) => void;
  initialLocation?: MapLocation;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  children: React.ReactNode;
}

export interface CardProps {
  className?: string;
  children: React.ReactNode;
}

export interface CardHeaderProps {
  className?: string;
  children: React.ReactNode;
}

export interface CardTitleProps {
  className?: string;
  children: React.ReactNode;
}

export interface CardContentProps {
  className?: string;
  children: React.ReactNode;
}

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  className?: string;
  children: React.ReactNode;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
} 