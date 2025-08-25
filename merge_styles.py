import re

def merge_header_btn_styles():
    """Объединяет лучшие стили header-btn из всех версий"""
    
    # Лучшие стили из всех версий
    merged_styles = """
        /* ОБЪЕДИНЕННЫЕ СТИЛИ HEADER-BTN - ЛУЧШИЕ ЧАСТИ ИЗ ВСЕХ ВЕРСИЙ */
        .header-btn {
            padding: 0.75rem 1.5rem;
            border-radius: 50px;
            text-decoration: none;
            font-family: 'Inter', sans-serif;
            font-weight: 600;
            font-size: 14px;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
            letter-spacing: 0.01em;
            position: relative;
            overflow: hidden;
            display: inline-flex;
            align-items: center;
            justify-content: center;
        }

        /* Анимация shimmer для всех кнопок */
        .header-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
            transition: left 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .header-btn:hover::before {
            left: 100%;
        }

        /* Primary кнопка - объединенные лучшие стили */
        .header-btn.primary {
            background: linear-gradient(135deg, #667eea, #764ba2, #f093fb);
            color: white;
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
            position: relative;
            overflow: hidden;
        }

        .header-btn.primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 35px rgba(102, 126, 234, 0.6);
        }

        .header-btn.primary:active {
            transform: translateY(0);
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }

        /* Secondary кнопка - объединенные лучшие стили */
        .header-btn.secondary {
            background: rgba(255, 255, 255, 0.8);
            color: #667eea;
            border: 2px solid transparent;
            background-clip: padding-box;
            position: relative;
            backdrop-filter: blur(10px);
        }

        /* Градиентная рамка для secondary кнопки */
        .header-btn.secondary::after {
            content: '';
            position: absolute;
            inset: 0;
            padding: 2px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            border-radius: inherit;
            mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            mask-composite: subtract;
            -webkit-mask-composite: xor;
            z-index: -1;
        }

        .header-btn.secondary:hover {
            background: rgba(255, 255, 255, 0.95);
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }

        .header-btn.secondary:active {
            transform: translateY(0);
        }

        /* Анимация при нажатии */
        .header-btn:active::before {
            left: 100%;
        }
    """
    
    print("Объединенные стили header-btn:")
    print(merged_styles)
    
    return merged_styles

if __name__ == "__main__":
    merge_header_btn_styles() 