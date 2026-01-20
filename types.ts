// Import React to fix "Cannot find namespace 'React'" error
import React from 'react';

export interface NavItem {
  label: string;
  href: string;
  active?: boolean;
}

export interface SocialLink {
  icon: React.ReactNode;
  href: string;
  name: string;
}
