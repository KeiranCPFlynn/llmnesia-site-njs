'use client';

import { useMemo, useState } from 'react';

// Client-side filter over the blog index. The full list is server-rendered
// inside this component, so crawlers and no-JS visitors still see every post;
// the input only narrows what's already on the page. Matching is a simple
// AND-of-terms substring test against a precomputed haystack (title, summary,
// keywords, category) so a query like "claude code search" finds posts that
// contain all three words in any field.
export default function BlogSearch({ posts }) {
  const [query, setQuery] = useState('');

  const terms = useMemo(
    () =>
      query
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean),
    [query]
  );

  const filtered = useMemo(() => {
    if (terms.length === 0) return posts;
    return posts.filter((post) => terms.every((term) => post.haystack.includes(term)));
  }, [posts, terms]);

  const isSearching = terms.length > 0;

  return (
    <div className="blog-search">
      <div className="blog-search__field" role="search">
        <svg
          className="blog-search__icon"
          viewBox="0 0 20 20"
          aria-hidden="true"
          focusable="false"
        >
          <circle cx="9" cy="9" r="6" />
          <line x1="13.5" y1="13.5" x2="18" y2="18" />
        </svg>
        <input
          type="search"
          className="blog-search__input"
          placeholder="Search the guides…"
          aria-label="Search blog posts"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          autoComplete="off"
        />
        {isSearching && (
          <button
            type="button"
            className="blog-search__clear"
            onClick={() => setQuery('')}
            aria-label="Clear search"
          >
            Clear
          </button>
        )}
      </div>

      <p className="blog-search__count" role="status" aria-live="polite">
        {isSearching
          ? `${filtered.length} ${filtered.length === 1 ? 'result' : 'results'} for “${query.trim()}”`
          : `${posts.length} guides`}
      </p>

      {filtered.length > 0 ? (
        <ol className="post-list">
          {filtered.map((post) => (
            <li key={post.slug} className="post-list__item">
              <a href={`/blog/${post.slug}`} className="post-list__link">
                <div className="post-list__top">
                  <time dateTime={post.publishDate}>{post.dateLabel}</time>
                  {post.categoryLabel && (
                    <span className="post-list__cat">{post.categoryLabel}</span>
                  )}
                </div>
                <h2>{post.title}</h2>
                <p>{post.summary}</p>
              </a>
            </li>
          ))}
        </ol>
      ) : (
        <p className="blog-search__empty">
          No guides match “{query.trim()}”. Try a broader term — a platform name, a
          verb like “search” or “export”, or the tool you use.
        </p>
      )}
    </div>
  );
}
