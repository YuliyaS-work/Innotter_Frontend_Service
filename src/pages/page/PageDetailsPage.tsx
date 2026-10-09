import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../store/store';
import { Sidebar } from '../../components/common/Sidebar';
import { RightPanel } from '../../components/common/RightPanel';
import { PageRightPanel } from '../../components/page/PageRightPanel';
import { Button } from '../../components/common/Button_profile';
import { getPageWithPosts, PageResponse, PostResponse } from '../../api/content';
import '../../styles/page/PageDetailsPage.scss';

export const PageDetailsPage: React.FC = () => {
  const { pageId } = useParams<{ pageId: string }>();


  // Блоки состояний
  const [page, setPage] = useState<PageResponse | null>(null);
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [myPages, setMyPages] = useState<PageResponse[]>([]); // Список МОИХ страниц для боковой панели
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  // Modal window for adding a post
  const [isAddPostOpen, setIsAddPostOpen] = useState<boolean>(false);

  // user ID from Redux or localStorage
  const authUser = useAppSelector((state) => state.auth.user);
  const currentUserId = authUser?.id || localStorage.getItem('user_id');


  console.log('--- DEBUG OWNER CHECK ---');
  console.log('page.user_id:', page?.user_id, typeof page?.user_id);
  console.log('currentUserId from App:', currentUserId, typeof currentUserId);
  console.log('Do they match?:', String(page?.user_id).trim() === String(currentUserId).trim());

  // Checking owner
  const isOwner = useMemo(() => {
    if (!page?.user_id || !currentUserId) return false;
    return String(page.user_id).trim() === String(currentUserId).trim();
  }, [page?.user_id, currentUserId]);

  const fetchPageDetails = useCallback(async () => {
    if (!pageId) return;
    try {
      setLoading(true);
      setError(null);

      // request data page and its posts
      const data = await getPageWithPosts(pageId);
      setPage(data.page);

      // structure of the posts
      const rawPosts = data.posts;
      if (Array.isArray(rawPosts)) {
        setPosts(rawPosts);
      } else if (rawPosts && typeof rawPosts === 'object' && 'results' in rawPosts) {
        setPosts((rawPosts as any).results || []);
      } else {
        setPosts([]);
      }
    } catch (err: any) {
      console.error('Failed to load page details:', err);
      setError('Page not found or failed to load.');
    } finally {
      setLoading(false);
    }
  }, [pageId]);

  useEffect(() => {
    fetchPageDetails();
  }, [fetchPageDetails]);

  if (loading) return <div className="page-loading">Loading page data...</div>;
  if (error || !page) return <div className="page-error">{error || 'Page not found'}</div>;

  return (
    <div className="page-details-layout">
      <Sidebar />

      <main className="page-details-main">
        <div className="page-header-card">
          <div className="page-header-top">
            <div>
              <h1>{page.name}</h1>
              <p className="page-description">{page.description}</p>
            </div>

            {/* follow button only for any authenticated users exclude owner */}
            {!isOwner && (
              <div className="follow-btn-wrapper">
                <Button
                  bgColor={page.is_followed ? '#6c757d' : '#ff6b00'}
                  fullWidth
                  onClick={() => console.log('Follow clicked')}
                >
                  {page.is_followed ? 'Unfollow' : 'Follow'}
                </Button>
              </div>
            )}
          </div>

          <div className="page-tags">
            {page.tags?.map((t) => (
              <span key={t.id} className="tag-badge">
                #{t.name}
              </span>
            ))}
          </div>
        </div>

        {/* post list */}
        <section className="posts-section">
          <h2>Posts ({posts.length})</h2>
          {posts.length === 0 ? (
            <p className="no-posts">No posts created yet.</p>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="post-card">
                <p className="post-content">{post.content}</p>
                <div className="post-footer">
                  <button
                    className="like-btn"
                    onClick={() => console.log('Like clicked')}
                  >
                    <span>{post.is_liked ? '❤️' : '🤍'}</span>
                    <span>{post.likes_count}</span>
                  </button>
                  <small>{new Date(post.created_at).toLocaleDateString()}</small>
                </div>
              </div>
            ))
          )}
        </section>
      </main>

      {/* right panel */}
      <RightPanel>
        <PageRightPanel
          currentPage={page}
          isOwner={isOwner}
          myPages={myPages}
          onAddPostClick={() => setIsAddPostOpen(true)}
          onPageCreated={(newPage) => setMyPages((prev) => [...prev, newPage])}
        />
      </RightPanel>
    </div>
  );
};