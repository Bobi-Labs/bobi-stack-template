#!/usr/bin/env bash
# Plays a subtle sound when Claude finishes responding.
# Cross-platform: macOS, Linux, Windows.

input=$(cat)

# Check for python
PYTHON=""
if command -v python3 &>/dev/null; then
  PYTHON="python3"
elif command -v python &>/dev/null; then
  PYTHON="python"
fi

# Check if this is a stop hook already active (prevent loops)
if [ -n "$PYTHON" ]; then
  active=$($PYTHON -c "import json,sys; d=json.load(sys.stdin); print(d.get('stop_hook_active','false'))" <<< "$input" 2>/dev/null)
  if [ "$active" = "true" ] || [ "$active" = "True" ]; then
    exit 0
  fi
fi

# Play notification sound
if [[ "$OSTYPE" == "darwin"* ]]; then
  afplay /System/Library/Sounds/Submarine.aiff &
elif [[ "$OSTYPE" == "linux"* ]]; then
  if command -v paplay &>/dev/null; then
    paplay /usr/share/sounds/freedesktop/stereo/complete.oga 2>/dev/null &
  elif command -v aplay &>/dev/null; then
    aplay /usr/share/sounds/sound-icons/prompt.wav 2>/dev/null &
  fi
else
  # Windows — PowerShell beep
  powershell -c "[System.Media.SystemSounds]::Asterisk.Play()" 2>/dev/null &
fi

exit 0
