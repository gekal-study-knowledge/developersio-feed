---
layout: default
title: DevelopersIO Feed Archive
---

<style>
  .post-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    padding: 0;
    list-style: none;
  }
  .post-card {
    border: 1px solid #e1e4e8;
    border-radius: 8px;
    padding: 20px;
    transition: transform 0.2s, box-shadow 0.2s;
    background-color: #fff;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .post-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    border-color: #0366d6;
  }
  .post-card-link {
    text-decoration: none;
    color: inherit;
    display: block;
    height: 100%;
  }
  .post-card-link:hover {
    text-decoration: none;
  }
  .post-card-title {
    margin: 0 0 10px 0;
    font-size: 1.25rem;
    color: #0366d6;
  }
  .post-card-date {
    font-size: 0.9rem;
    color: #586069;
    margin-top: auto;
  }
</style>

# DevelopersIO Feed Archive

<div class="post-cards">
  {% for post in site.posts %}
    <div class="post-card-container">
      <a href="{{ post.url | relative_url }}" class="post-card-link">
        <div class="post-card">
          <h2 class="post-card-title">{{ post.title }}</h2>
          <div class="post-card-date">
            <time datetime="{{ post.date | date_to_xmlschema }}">
              {{ post.date | date: "%Y年%m月%d日" }}
            </time>
          </div>
        </div>
      </a>
    </div>
  {% endfor %}
</div>
