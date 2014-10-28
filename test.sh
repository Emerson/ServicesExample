#!/usr/bin/env bash
cd Stories && bundle exec rake && cd ../Auth && mocha && cd ../Web-UI && ember test