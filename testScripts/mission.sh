backend="br5f7-7uaaa-aaaaa-qaaca-cai"
mission="td2xg-gefif-gakwn-2ji3k-jyhij-dl5o4-sj2gj-fuft7-d6syh-uy3so-mae_0_0"
spaceID="td2xg-gefif-gakwn-2ji3k-jyhij-dl5o4-sj2gj-fuft7-d6syh-uy3so-mae_0"

dfx canister call $backend get_mission '("'${mission}'")'

dfx canister call $backend get_all_space_missions '("'${spaceID}'")'

dfx canister call $backend get_submission '("'${mission}_0'")'