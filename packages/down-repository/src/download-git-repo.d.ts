declare module 'download-git-repo' {
  type RepoCallback = (err: Error | null) => void;
  type Repo = string;
  function download(repo: Repo | { owner: string; name: string; ref?: string }, target: string, opts: { clone?: boolean }, cb: RepoCallback): void;
  export = download;
}