import React, { lazy } from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Routes,
} from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout.jsx';
import { DashboardLayout } from '../layouts/DashboardLayout.jsx';
import { AdminLayout } from '../layouts/AdminLayout.jsx';
import { ProtectedRoute } from './ProtectedRoute.jsx';

// Lazy-loaded routes
const HomePage = lazy(() => import('../pages/HomePage.jsx'));
const SinglePostPage = lazy(() => import('../pages/SinglePostPage.jsx'));
const CategoryPage = lazy(() => import('../pages/CategoryPage.jsx'));
const TagPage = lazy(() => import('../pages/TagPage.jsx'));
const SearchPage = lazy(() => import('../pages/SearchPage.jsx'));
const BookmarksPage = lazy(() => import('../pages/BookmarksPage.jsx'));
const LoginPage = lazy(() => import('../pages/LoginPage.jsx'));
const RegisterPage = lazy(() => import('../pages/RegisterPage.jsx'));
const StyleguidePage = lazy(() => import('../pages/StyleguidePage.jsx'));
const ForbiddenPage = lazy(() => import('../pages/ForbiddenPage.jsx'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage.jsx'));

// Author back-of-house
const DashboardPostsPage = lazy(() => import('../pages/DashboardPostsPage.jsx'));
const PostEditorPage = lazy(() => import('../pages/PostEditorPage.jsx'));

// Admin back-of-house
const AdminUsersPage = lazy(() => import('../pages/AdminUsersPage.jsx'));
const AdminCommentsPage = lazy(() => import('../pages/AdminCommentsPage.jsx'));
const AdminPostsPage = lazy(() => import('../pages/AdminPostsPage.jsx'));

export const routeElements = (
  <>
    {/* Public Layout Routes */}
    <Route element={<PublicLayout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/posts/:slug" element={<SinglePostPage />} />
      <Route path="/category/:name" element={<CategoryPage />} />
      <Route path="/tag/:name" element={<TagPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/styleguide" element={<StyleguidePage />} />
      <Route path="/403" element={<ForbiddenPage />} />

      {/* Protected Bookmarks for any logged in user */}
      <Route
        path="/bookmarks"
        element={
          <ProtectedRoute allowedRoles={['reader', 'author', 'admin']}>
            <BookmarksPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFoundPage />} />
    </Route>

    {/* Author Dashboard (author or admin) */}
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute allowedRoles={['author', 'admin']}>
          <DashboardLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<DashboardPostsPage />} />
      <Route path="new" element={<PostEditorPage />} />
      <Route path="edit/:id" element={<PostEditorPage />} />
    </Route>

    {/* Admin Panel (admin only) */}
    <Route
      path="/admin"
      element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminLayout />
        </ProtectedRoute>
      }
    >
      <Route path="users" element={<AdminUsersPage />} />
      <Route path="comments" element={<AdminCommentsPage />} />
      <Route path="posts" element={<AdminPostsPage />} />
    </Route>
  </>
);

export const router = createBrowserRouter(
  createRoutesFromElements(routeElements)
);

export function AppRoutes() {
  return <Routes>{routeElements}</Routes>;
}
