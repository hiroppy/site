# .wt_hook.fish - Executed after 'wt add' command in worktree directory
# Available variables:
# - $WT_WORKTREE_PATH: Path to the new worktree (current directory)
# - $WT_BRANCH_NAME: Name of the branch
# - $WT_PROJECT_ROOT: Path to the original project root

# Files and directories to copy from project root to worktree directory
# Add or remove file/directory names as needed
set copy_items ".env" ".claude" "dist" ".astro"

for item in $copy_items
    if test -f "$WT_PROJECT_ROOT/$item"
        # Copy file
        cp "$WT_PROJECT_ROOT/$item" "$item"
        echo "Copied file $item to worktree"
    else if test -d "$WT_PROJECT_ROOT/$item"
        # Copy directory recursively
        cp -r "$WT_PROJECT_ROOT/$item" "$item"
        echo "Copied directory $item to worktree"
    end
end

# Add your custom initialization commands here
# Example: Install dependencies
# npm install
npm run setup
pnpm i
