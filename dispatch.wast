(module
 (type $vi (func (param i32)))
 (type $v (func))
 (type $viii (func (param i32 i32 i32)))
 (type $vii (func (param i32 i32)))
 (import "env" "00CN" (func $00CN (param i32)))
 (import "env" "00E0" (func $00E0))
 (import "env" "00EE" (func $00EE))
 (import "env" "00FB" (func $00FB))
 (import "env" "00FC" (func $00FC))
 (import "env" "00FD" (func $00FD))
 (import "env" "00FE" (func $00FE))
 (import "env" "00FF" (func $00FF))
 (import "env" "0NNN" (func $0NNN (param i32 i32 i32)))
 (import "env" "1NNN" (func $1NNN (param i32 i32 i32)))
 (import "env" "2NNN" (func $2NNN (param i32 i32 i32)))
 (import "env" "3XKK" (func $3XKK (param i32 i32)))
 (import "env" "4XKK" (func $4XKK (param i32 i32)))
 (import "env" "5XY0" (func $5XY0 (param i32 i32)))
 (import "env" "6XKK" (func $6XKK (param i32 i32)))
 (import "env" "7XKK" (func $7XKK (param i32 i32)))
 (import "env" "8XY0" (func $8XY0 (param i32 i32)))
 (import "env" "8XY1" (func $8XY1 (param i32 i32)))
 (import "env" "8XY2" (func $8XY2 (param i32 i32)))
 (import "env" "8XY3" (func $8XY3 (param i32 i32)))
 (import "env" "8XY4" (func $8XY4 (param i32 i32)))
 (import "env" "8XY5" (func $8XY5 (param i32 i32)))
 (import "env" "8XY6" (func $8XY6 (param i32 i32)))
 (import "env" "8XY7" (func $8XY7 (param i32 i32)))
 (import "env" "8XYE" (func $8XYE (param i32 i32)))
 (import "env" "9XY0" (func $9XY0 (param i32 i32)))
 (import "env" "ANNN" (func $ANNN (param i32 i32 i32)))
 (import "env" "BNNN" (func $BNNN (param i32 i32 i32)))
 (import "env" "CXKK" (func $CXKK (param i32 i32)))
 (import "env" "DXY0" (func $DXY0 (param i32 i32)))
 (import "env" "DXYN" (func $DXYN (param i32 i32 i32)))
 (import "env" "EX9E" (func $EX9E (param i32)))
 (import "env" "EXA1" (func $EXA1 (param i32)))
 (import "env" "FX07" (func $FX07 (param i32)))
 (import "env" "FX0A" (func $FX0A (param i32)))
 (import "env" "FX15" (func $FX15 (param i32)))
 (import "env" "FX18" (func $FX18 (param i32)))
 (import "env" "FX1E" (func $FX1E (param i32)))
 (import "env" "FX29" (func $FX29 (param i32)))
 (import "env" "FX30" (func $FX30 (param i32)))
 (import "env" "FX33" (func $FX33 (param i32)))
 (import "env" "FX55" (func $FX55 (param i32)))
 (import "env" "FX65" (func $FX65 (param i32)))
 (import "env" "FX75" (func $FX75 (param i32)))
 (import "env" "FX85" (func $FX85 (param i32)))
 (import "env" "unknownOp" (func $unknownOp (param i32)))
 (memory $0 0)
 (export "dispatch" (func $dispatch))
 (func $dispatch (; 46 ;) (type $vi) (param $0 i32)
  (block $leave
   (block $unknown
    (block $F_
     (block $E_
      (block $D__
       (block $C___
        (block $B___
         (block $A___
          (block $9__
           (block $8__
            (block $7___
             (block $6___
              (block $5__
               (block $4___
                (block $3___
                 (block $2___
                  (block $1___
                   (block $0
                    (br_table $0 $1___ $2___ $3___ $4___ $5__ $6___ $7___ $8__ $9__ $A___ $B___ $C___ $D__ $E_ $F_ $unknown
                     (i32.shr_u
                      (get_local $0)
                      (i32.const 12)
                     )
                    )
                   )
                   (block $0___
                    (block $00
                     (br_table $00 $0___
                      (i32.and
                       (i32.shr_u
                        (get_local $0)
                        (i32.const 8)
                       )
                       (i32.const 15)
                      )
                     )
                    )
                    (block $00F
                     (block $00E
                      (block $00C_
                       (br_table $unknown $unknown $unknown $unknown $unknown $unknown $unknown $unknown $unknown $unknown $unknown $unknown $00C_ $unknown $00E $00F $unknown
                        (i32.and
                         (i32.shr_u
                          (get_local $0)
                          (i32.const 4)
                         )
                         (i32.const 15)
                        )
                       )
                      )
                      (call $00CN
                       (i32.and
                        (get_local $0)
                        (i32.const 15)
                       )
                      )
                      (br $leave)
                     )
                     (block $00EE
                      (block $00E0
                       (br_table $00E0 $unknown $unknown $unknown $unknown $unknown $unknown $unknown $unknown $unknown $unknown $unknown $unknown $unknown $00EE $unknown
                        (i32.and
                         (get_local $0)
                         (i32.const 15)
                        )
                       )
                      )
                      (call $00E0)
                      (br $leave)
                     )
                     (call $00EE)
                     (br $leave)
                    )
                    (block $00FF
                     (block $00FE
                      (block $00FD
                       (block $00FC
                        (block $00FB
                         (br_table $unknown $unknown $unknown $unknown $unknown $unknown $unknown $unknown $unknown $unknown $unknown $00FB $00FC $00FD $00FE $00FF $unknown
                          (i32.and
                           (get_local $0)
                           (i32.const 15)
                          )
                         )
                        )
                        (call $00FB)
                        (br $leave)
                       )
                       (call $00FC)
                       (br $leave)
                      )
                      (call $00FD)
                      (br $leave)
                     )
                     (call $00FE)
                     (br $leave)
                    )
                    (call $00FF)
                    (br $leave)
                   )
                   (call $0NNN
                    (i32.and
                     (i32.shr_u
                      (get_local $0)
                      (i32.const 8)
                     )
                     (i32.const 15)
                    )
                    (i32.and
                     (i32.shr_u
                      (get_local $0)
                      (i32.const 4)
                     )
                     (i32.const 15)
                    )
                    (i32.and
                     (get_local $0)
                     (i32.const 15)
                    )
                   )
                   (br $leave)
                  )
                  (call $1NNN
                   (i32.and
                    (i32.shr_u
                     (get_local $0)
                     (i32.const 8)
                    )
                    (i32.const 15)
                   )
                   (i32.and
                    (i32.shr_u
                     (get_local $0)
                     (i32.const 4)
                    )
                    (i32.const 15)
                   )
                   (i32.and
                    (get_local $0)
                    (i32.const 15)
                   )
                  )
                  (br $leave)
                 )
                 (call $2NNN
                  (i32.and
                   (i32.shr_u
                    (get_local $0)
                    (i32.const 8)
                   )
                   (i32.const 15)
                  )
                  (i32.and
                   (i32.shr_u
                    (get_local $0)
                    (i32.const 4)
                   )
                   (i32.const 15)
                  )
                  (i32.and
                   (get_local $0)
                   (i32.const 15)
                  )
                 )
                 (br $leave)
                )
                (call $3XKK
                 (i32.and
                  (i32.shr_u
                   (get_local $0)
                   (i32.const 8)
                  )
                  (i32.const 15)
                 )
                 (i32.and
                  (get_local $0)
                  (i32.const 255)
                 )
                )
                (br $leave)
               )
               (call $4XKK
                (i32.and
                 (i32.shr_u
                  (get_local $0)
                  (i32.const 8)
                 )
                 (i32.const 15)
                )
                (i32.and
                 (get_local $0)
                 (i32.const 255)
                )
               )
               (br $leave)
              )
              (block $5__0
               (br_table $5__0 $unknown
                (i32.and
                 (get_local $0)
                 (i32.const 15)
                )
               )
              )
              (call $5XY0
               (i32.and
                (i32.shr_u
                 (get_local $0)
                 (i32.const 8)
                )
                (i32.const 15)
               )
               (i32.and
                (i32.shr_u
                 (get_local $0)
                 (i32.const 4)
                )
                (i32.const 15)
               )
              )
              (br $leave)
             )
             (call $6XKK
              (i32.and
               (i32.shr_u
                (get_local $0)
                (i32.const 8)
               )
               (i32.const 15)
              )
              (i32.and
               (get_local $0)
               (i32.const 255)
              )
             )
             (br $leave)
            )
            (call $7XKK
             (i32.and
              (i32.shr_u
               (get_local $0)
               (i32.const 8)
              )
              (i32.const 15)
             )
             (i32.and
              (get_local $0)
              (i32.const 255)
             )
            )
            (br $leave)
           )
           (block $8__E
            (block $8__7
             (block $8__6
              (block $8__5
               (block $8__4
                (block $8__3
                 (block $8__2
                  (block $8__1
                   (block $8__0
                    (br_table $8__0 $8__1 $8__2 $8__3 $8__4 $8__5 $8__6 $8__7 $unknown $unknown $unknown $unknown $unknown $unknown $8__E $unknown
                     (i32.and
                      (get_local $0)
                      (i32.const 15)
                     )
                    )
                   )
                   (call $8XY0
                    (i32.and
                     (i32.shr_u
                      (get_local $0)
                      (i32.const 8)
                     )
                     (i32.const 15)
                    )
                    (i32.and
                     (i32.shr_u
                      (get_local $0)
                      (i32.const 4)
                     )
                     (i32.const 15)
                    )
                   )
                   (br $leave)
                  )
                  (call $8XY1
                   (i32.and
                    (i32.shr_u
                     (get_local $0)
                     (i32.const 8)
                    )
                    (i32.const 15)
                   )
                   (i32.and
                    (i32.shr_u
                     (get_local $0)
                     (i32.const 4)
                    )
                    (i32.const 15)
                   )
                  )
                  (br $leave)
                 )
                 (call $8XY2
                  (i32.and
                   (i32.shr_u
                    (get_local $0)
                    (i32.const 8)
                   )
                   (i32.const 15)
                  )
                  (i32.and
                   (i32.shr_u
                    (get_local $0)
                    (i32.const 4)
                   )
                   (i32.const 15)
                  )
                 )
                 (br $leave)
                )
                (call $8XY3
                 (i32.and
                  (i32.shr_u
                   (get_local $0)
                   (i32.const 8)
                  )
                  (i32.const 15)
                 )
                 (i32.and
                  (i32.shr_u
                   (get_local $0)
                   (i32.const 4)
                  )
                  (i32.const 15)
                 )
                )
                (br $leave)
               )
               (call $8XY4
                (i32.and
                 (i32.shr_u
                  (get_local $0)
                  (i32.const 8)
                 )
                 (i32.const 15)
                )
                (i32.and
                 (i32.shr_u
                  (get_local $0)
                  (i32.const 4)
                 )
                 (i32.const 15)
                )
               )
               (br $leave)
              )
              (call $8XY5
               (i32.and
                (i32.shr_u
                 (get_local $0)
                 (i32.const 8)
                )
                (i32.const 15)
               )
               (i32.and
                (i32.shr_u
                 (get_local $0)
                 (i32.const 4)
                )
                (i32.const 15)
               )
              )
              (br $leave)
             )
             (call $8XY6
              (i32.and
               (i32.shr_u
                (get_local $0)
                (i32.const 8)
               )
               (i32.const 15)
              )
              (i32.and
               (i32.shr_u
                (get_local $0)
                (i32.const 4)
               )
               (i32.const 15)
              )
             )
             (br $leave)
            )
            (call $8XY7
             (i32.and
              (i32.shr_u
               (get_local $0)
               (i32.const 8)
              )
              (i32.const 15)
             )
             (i32.and
              (i32.shr_u
               (get_local $0)
               (i32.const 4)
              )
              (i32.const 15)
             )
            )
            (br $leave)
           )
           (call $8XYE
            (i32.and
             (i32.shr_u
              (get_local $0)
              (i32.const 8)
             )
             (i32.const 15)
            )
            (i32.and
             (i32.shr_u
              (get_local $0)
              (i32.const 4)
             )
             (i32.const 15)
            )
           )
           (br $leave)
          )
          (block $9__0
           (br_table $9__0 $unknown
            (i32.and
             (get_local $0)
             (i32.const 15)
            )
           )
          )
          (call $9XY0
           (i32.and
            (i32.shr_u
             (get_local $0)
             (i32.const 8)
            )
            (i32.const 15)
           )
           (i32.and
            (i32.shr_u
             (get_local $0)
             (i32.const 4)
            )
            (i32.const 15)
           )
          )
          (br $leave)
         )
         (call $ANNN
          (i32.and
           (i32.shr_u
            (get_local $0)
            (i32.const 8)
           )
           (i32.const 15)
          )
          (i32.and
           (i32.shr_u
            (get_local $0)
            (i32.const 4)
           )
           (i32.const 15)
          )
          (i32.and
           (get_local $0)
           (i32.const 15)
          )
         )
         (br $leave)
        )
        (call $BNNN
         (i32.and
          (i32.shr_u
           (get_local $0)
           (i32.const 8)
          )
          (i32.const 15)
         )
         (i32.and
          (i32.shr_u
           (get_local $0)
           (i32.const 4)
          )
          (i32.const 15)
         )
         (i32.and
          (get_local $0)
          (i32.const 15)
         )
        )
        (br $leave)
       )
       (call $CXKK
        (i32.and
         (i32.shr_u
          (get_local $0)
          (i32.const 8)
         )
         (i32.const 15)
        )
        (i32.and
         (get_local $0)
         (i32.const 255)
        )
       )
       (br $leave)
      )
      (block $D___
       (block $D__0
        (br_table $D__0 $D___
         (i32.and
          (get_local $0)
          (i32.const 15)
         )
        )
       )
       (call $DXY0
        (i32.and
         (i32.shr_u
          (get_local $0)
          (i32.const 8)
         )
         (i32.const 15)
        )
        (i32.and
         (i32.shr_u
          (get_local $0)
          (i32.const 4)
         )
         (i32.const 15)
        )
       )
       (br $leave)
      )
      (call $DXYN
       (i32.and
        (i32.shr_u
         (get_local $0)
         (i32.const 8)
        )
        (i32.const 15)
       )
       (i32.and
        (i32.shr_u
         (get_local $0)
         (i32.const 4)
        )
        (i32.const 15)
       )
       (i32.and
        (get_local $0)
        (i32.const 15)
       )
      )
      (br $leave)
     )
     (block $E_A
      (block $E_9
       (br_table $unknown $unknown $unknown $unknown $unknown $unknown $unknown $unknown $unknown $E_9 $E_A $unknown
        (i32.and
         (i32.shr_u
          (get_local $0)
          (i32.const 4)
         )
         (i32.const 15)
        )
       )
      )
      (block $E_9E
       (br_table $unknown $unknown $unknown $unknown $unknown $unknown $unknown $unknown $unknown $unknown $unknown $unknown $unknown $unknown $E_9E $unknown
        (i32.and
         (get_local $0)
         (i32.const 15)
        )
       )
      )
      (call $EX9E
       (i32.and
        (i32.shr_u
         (get_local $0)
         (i32.const 8)
        )
        (i32.const 15)
       )
      )
      (br $leave)
     )
     (block $E_A1
      (br_table $unknown $E_A1 $unknown
       (i32.and
        (get_local $0)
        (i32.const 15)
       )
      )
     )
     (call $EXA1
      (i32.and
       (i32.shr_u
        (get_local $0)
        (i32.const 8)
       )
       (i32.const 15)
      )
     )
     (br $leave)
    )
    (block $F_8
     (block $F_7
      (block $F_6
       (block $F_5
        (block $F_3
         (block $F_2
          (block $F_1
           (block $F_0
            (br_table $F_0 $F_1 $F_2 $F_3 $unknown $F_5 $F_6 $F_7 $F_8 $unknown
             (i32.and
              (i32.shr_u
               (get_local $0)
               (i32.const 4)
              )
              (i32.const 15)
             )
            )
           )
           (block $F_0A
            (block $F_07
             (br_table $unknown $unknown $unknown $unknown $unknown $unknown $unknown $F_07 $unknown $unknown $F_0A $unknown
              (i32.and
               (get_local $0)
               (i32.const 15)
              )
             )
            )
            (call $FX07
             (i32.and
              (i32.shr_u
               (get_local $0)
               (i32.const 8)
              )
              (i32.const 15)
             )
            )
            (br $leave)
           )
           (call $FX0A
            (i32.and
             (i32.shr_u
              (get_local $0)
              (i32.const 8)
             )
             (i32.const 15)
            )
           )
           (br $leave)
          )
          (block $F_1E
           (block $F_18
            (block $F_15
             (br_table $unknown $unknown $unknown $unknown $unknown $F_15 $unknown $unknown $F_18 $unknown $unknown $unknown $unknown $unknown $F_1E $unknown
              (i32.and
               (get_local $0)
               (i32.const 15)
              )
             )
            )
            (call $FX15
             (i32.and
              (i32.shr_u
               (get_local $0)
               (i32.const 8)
              )
              (i32.const 15)
             )
            )
            (br $leave)
           )
           (call $FX18
            (i32.and
             (i32.shr_u
              (get_local $0)
              (i32.const 8)
             )
             (i32.const 15)
            )
           )
           (br $leave)
          )
          (call $FX1E
           (i32.and
            (i32.shr_u
             (get_local $0)
             (i32.const 8)
            )
            (i32.const 15)
           )
          )
          (br $leave)
         )
         (block $F_29
          (br_table $unknown $unknown $unknown $unknown $unknown $unknown $unknown $unknown $unknown $F_29 $unknown
           (i32.and
            (get_local $0)
            (i32.const 15)
           )
          )
         )
         (call $FX29
          (i32.and
           (i32.shr_u
            (get_local $0)
            (i32.const 8)
           )
           (i32.const 15)
          )
         )
         (br $leave)
        )
        (block $F_33
         (block $F_30
          (br_table $F_30 $unknown $unknown $F_33 $unknown
           (i32.and
            (get_local $0)
            (i32.const 15)
           )
          )
         )
         (call $FX30
          (i32.and
           (i32.shr_u
            (get_local $0)
            (i32.const 8)
           )
           (i32.const 15)
          )
         )
         (br $leave)
        )
        (call $FX33
         (i32.and
          (i32.shr_u
           (get_local $0)
           (i32.const 8)
          )
          (i32.const 15)
         )
        )
        (br $leave)
       )
       (block $F_55
        (br_table $unknown $unknown $unknown $unknown $unknown $F_55 $unknown
         (i32.and
          (get_local $0)
          (i32.const 15)
         )
        )
       )
       (call $FX55
        (i32.and
         (i32.shr_u
          (get_local $0)
          (i32.const 8)
         )
         (i32.const 15)
        )
       )
       (br $leave)
      )
      (block $F_65
       (br_table $unknown $unknown $unknown $unknown $unknown $F_65 $unknown
        (i32.and
         (get_local $0)
         (i32.const 15)
        )
       )
      )
      (call $FX65
       (i32.and
        (i32.shr_u
         (get_local $0)
         (i32.const 8)
        )
        (i32.const 15)
       )
      )
      (br $leave)
     )
     (block $F_75
      (br_table $unknown $unknown $unknown $unknown $unknown $F_75 $unknown
       (i32.and
        (get_local $0)
        (i32.const 15)
       )
      )
     )
     (call $FX75
      (i32.and
       (i32.shr_u
        (get_local $0)
        (i32.const 8)
       )
       (i32.const 15)
      )
     )
     (br $leave)
    )
    (block $F_85
     (br_table $unknown $unknown $unknown $unknown $unknown $F_85 $unknown
      (i32.and
       (get_local $0)
       (i32.const 15)
      )
     )
    )
    (call $FX85
     (i32.and
      (i32.shr_u
       (get_local $0)
       (i32.const 8)
      )
      (i32.const 15)
     )
    )
    (br $leave)
   )
   (call $unknownOp
    (get_local $0)
   )
  )
 )
)

