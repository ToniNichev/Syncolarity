#!/bin/bash
# Version 1.1

printf "\n\nPUSH Local => OwnCloud\n\n"

sudo rsync --update -avuzP --delete --exclude-from=./exclusions.conf ../../sync-folder/ ../../dest-folder

# -u makes rsync transfer skip files which are newer in dest than in src
# -z turns on compression
# -P turns on --partial and --progress
# --partial makes rsync keep partially transferred files if the transfer is interrupted
# --progress shows a progress bar for each transfer, useful if you transfer big files

