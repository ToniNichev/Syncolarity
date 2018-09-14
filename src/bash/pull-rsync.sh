#!/bin/bash
# Vesrion 1.1

printf "\n\nPULL OwnCloud => Local\n\n"

sudo rsync -avuzP --update --delete --exclude-from=./exclusions.conf ../../dest-folder/ ../../sync-folder

# -u makes rsync transfer skip files which are newer in dest than in src
# -z turns on compression
# -P turns on --partial and --progress
# --partial makes rsync keep partially transferred files if the transfer is interrupted
# --progress shows a progress bar for each transfer, useful if you transfer big files
