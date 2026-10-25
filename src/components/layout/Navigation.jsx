import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { SITE_CONFIG } from '../../config/site.js';
import {
  IconSearch,
  IconSun,
  IconMoon,
  IconBookmark,
  IconMenu,
  IconClose,
  IconUser
} from '../ui/Icons.jsx';

export function Navigation() {
  const { user, role, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <nav className="border-b border-rule mb-8">
      <div className="max-w-site mx-auto px-4 sm:px-6">
        <div className="h-11 flex items-center justify-between font-mono text-xs uppercase tracking-meta">
          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1 text-ink hover:text-accent"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <IconClose className="w-5 h-5" /> : <IconMenu className="w-5 h-5" />}
          </button>

          {/* Categories Desktop List */}
          <div className="hidden md:flex items-center gap-7">
            {SITE_CONFIG.categories.map((cat) => (
              <NavLink
                key={cat.slug}
                to={`/category/${cat.slug}`}
                className={({ isActive }) =>
                  `hover-underline-animation transition-colors ${
                    isActive ? 'text-accent font-semibold' : 'text-ink-soft hover:text-ink'
                  }`
                }
              >
                {cat.name}
              </NavLink>
            ))}
          </div>

          {/* Right Action Items */}
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Search */}
            <Link
              to="/search"
              aria-label="Search articles"
              className="p-1 text-ink-soft hover:text-accent transition-colors"
            >
              <IconSearch className="w-4 h-4" />
            </Link>

            {/* Bookmarks (if logged in) */}
            {isAuthenticated && (
              <Link
                to="/bookmarks"
                aria-label="My bookmarks"
                className="p-1 text-ink-soft hover:text-accent transition-colors"
              >
                <IconBookmark className="w-4 h-4" />
              </Link>
            )}

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Toggle theme (currently ${theme})`}
              className="p-1 text-ink-soft hover:text-ink transition-colors"
            >
              {theme === 'dark' ? <IconSun className="w-4 h-4" /> : <IconMoon className="w-4 h-4" />}
            </button>

            {/* Auth / Account Profile */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 text-ink hover:text-accent transition-colors focus:outline-none"
                >
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-6 h-6 rounded-full object-cover border border-rule"
                    />
                  ) : (
                    <IconUser className="w-4 h-4" />
                  )}
                  <span className="hidden lg:inline">{user?.name?.split(' ')[0]}</span>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-paper border border-ink z-50 p-2 shadow-none flex flex-col gap-1">
                    <div className="px-3 py-2 border-b border-rule">
                      <p className="font-sans font-semibold text-xs text-ink truncate">{user?.name}</p>
                      <p className="font-mono text-[0.625rem] text-ink-soft uppercase">{role}</p>
                    </div>

                    {(role === 'author' || role === 'admin') && (
                      <Link
                        to="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="px-3 py-1.5 text-xs text-ink hover:bg-paper-2 text-left"
                      >
                        Author Dashboard
                      </Link>
                    )}

                    {role === 'admin' && (
                      <Link
                        to="/admin/posts"
                        onClick={() => setUserDropdownOpen(false)}
                        className="px-3 py-1.5 text-xs text-ink hover:bg-paper-2 text-left"
                      >
                        Admin Panel
                      </Link>
                    )}

                    <Link
                      to="/bookmarks"
                      onClick={() => setUserDropdownOpen(false)}
                      className="px-3 py-1.5 text-xs text-ink hover:bg-paper-2 text-left"
                    >
                      Saved Stories
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="px-3 py-1.5 text-xs text-destructive hover:bg-paper-2 text-left border-t border-rule mt-1"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="text-xs uppercase tracking-meta text-ink hover:text-accent font-semibold"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-rule flex flex-col gap-3 font-mono text-xs uppercase tracking-meta">
            {SITE_CONFIG.categories.map((cat) => (
              <NavLink
                key={cat.slug}
                to={`/category/${cat.slug}`}
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 text-ink hover:text-accent"
              >
                {cat.name}
              </NavLink>
            ))}
            <div className="pt-2 border-t border-rule flex items-center justify-between">
              <Link
                to="/styleguide"
                onClick={() => setMobileMenuOpen(false)}
                className="text-ink-soft hover:text-accent"
              >
                Styleguide
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
